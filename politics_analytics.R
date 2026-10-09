# ==============================================================================
# Refined MCA: Thai Political Values & Personal Autonomy
# Wave 7 World Values Survey (Thailand Sample)
# ==============================================================================

library(tidyverse)
library(haven)
library(FactoMineR)
library(factoextra)

# 1. Load Data
# Update with your local file name
wvs_raw <- readRDS("WVS_Cross-National_Wave_7_rds_v6_0.rds")

# 2. Clean & Dichotomize to Eliminate "Fence-Sitter" Artifacts
thai_mca_clean <- wvs_raw %>%
  filter(B_COUNTRY_ALPHA == "THA" | B_COUNTRY == 764) %>%
  # WVS metadata contains duplicate value labels in some haven_labelled
  # columns; remove that metadata before replacing negative missing-value codes.
  mutate(across(where(haven::is.labelled), ~ as.numeric(.x))) %>%
  mutate(across(where(is.numeric), ~ replace(.x, .x < 0, NA))) %>%
  transmute(
    # --- ACTIVE VARIABLES (10 Focused Items) ---
    
    # 1. Regime, Order & Paternalism
    Society_Reform = factor(case_when(
      Q42 == 1 ~ "Radical Change",
      Q42 == 2 ~ "Gradual Reform",
      Q42 == 3 ~ "Defend Society"
    )),
    Army_Rule = factor(case_when(
      Q237 %in% 1:2 ~ "Army Rule: Good",
      Q237 %in% 3:4 ~ "Army Rule: Bad"
    )),
    Strong_Leader = factor(case_when(
      Q235 %in% 1:2 ~ "Leader: Good",
      Q235 %in% 3:4 ~ "Leader: Bad"
    )),
    Army_Democratic = factor(case_when(
      Q245 %in% 1:5  ~ "Army Coup: Non-Dem",
      Q245 %in% 6:10 ~ "Army Coup: Compatible"
    )),

    # 2. Personal Autonomy & LGBTQ+ Sentiment
    LGBTQ_Justifiable = factor(case_when(
      Q182 %in% 1:4  ~ "Gay: Never/Rarely",
      Q182 %in% 5:10 ~ "Gay: Justifiable"
    )),
    SameSex_Parents = factor(case_when(
      Q36 %in% 1:2 ~ "Gay Parents: Agree",
      Q36 %in% 3:5 ~ "Gay Parents: Disagree/Neutral"
    )),

    # 3. Gender Roles & Equality
    Men_Better_Leaders = factor(case_when(
      Q29 %in% 1:2 ~ "Men Lead: Agree",
      Q29 %in% 3:4 ~ "Men Lead: Disagree"
    )),
    Men_Job_Priority = factor(case_when(
      Q33 %in% 1:2 ~ "Men Job: Agree",
      Q33 %in% 3:5 ~ "Men Job: Disagree/Neutral"
    )),

    # 4. Corruption & State Welfare
    Corruption_Level = factor(case_when(
      Q112 %in% 8:10 ~ "Corrupt: High",
      Q112 %in% 1:7  ~ "Corrupt: Low/Mod"
    )),
    Gov_Responsibility = factor(case_when(
      Q108 %in% 1:5  ~ "Welfare: State",
      Q108 %in% 6:10 ~ "Welfare: Self-Reliance"
    )),

    # --- SUPPLEMENTARY VARIABLES (Projected Only) ---
    Ideology_LeftRight = factor(case_when(
      Q240 %in% 1:4  ~ "Left",
      Q240 %in% 5:6  ~ "Center",
      Q240 %in% 7:10 ~ "Right",
      is.na(Q240)    ~ "No Ideology Label"
    )),
    Gender = factor(case_when(
      Q260 == 1 ~ "Male",
      Q260 == 2 ~ "Female"
    )),
    Age_Group = factor(case_when(
      Q262 < 30              ~ "18-29",
      Q262 >= 30 & Q262 < 50 ~ "30-49",
      Q262 >= 50             ~ "50+"
    )),
    Education = factor(case_when(
      Q275 %in% 0:2 ~ "Edu: Low",
      Q275 %in% 3:5 ~ "Edu: Mid",
      Q275 %in% 6:8 ~ "Edu: High"
    ))
  ) %>%
  drop_na(Society_Reform:Gov_Responsibility)

# 3. Fit MCA (10 Active, 4 Supplementary)
res_mca <- MCA(
  thai_mca_clean,
  quanti.sup = NULL,
  quali.sup = 11:14,
  graph = FALSE
)

# 4. Diagnostic Tables & Raw Numbers
cat("\n=== EIGENVALUES & INERTIA ===\n")
print(round(res_mca$eig[1:5, ], 3))

var_stats <- tibble::tibble(
  Category     = rownames(res_mca$var$coord),
  Dim1_Coord   = round(res_mca$var$coord[, 1], 3),
  Dim1_Contrib = round(res_mca$var$contrib[, 1], 2),
  Dim1_Cos2    = round(res_mca$var$cos2[, 1], 3),
  Dim2_Coord   = round(res_mca$var$coord[, 2], 3),
  Dim2_Contrib = round(res_mca$var$contrib[, 2], 2),
  Dim2_Cos2    = round(res_mca$var$cos2[, 2], 3)
)

cutoff <- round(100 / nrow(var_stats), 2)
cat("\nThreshold for significant contribution (100 / K):", cutoff, "%\n\n")

cat("=== TOP DRIVERS: DIMENSION 1 ===\n")
var_stats %>%
  arrange(desc(Dim1_Contrib)) %>%
  select(Category, Dim1_Coord, Dim1_Contrib, Dim1_Cos2) %>%
  head(10) %>%
  print()

cat("\n=== TOP DRIVERS: DIMENSION 2 ===\n")
var_stats %>%
  arrange(desc(Dim2_Contrib)) %>%
  select(Category, Dim2_Coord, Dim2_Contrib, Dim2_Cos2) %>%
  head(10) %>%
  print()

cat("\n=== SUPPLEMENTARY DEMOGRAPHICS & IDEOLOGY ===\n")
sup_stats <- tibble::tibble(
  Category   = rownames(res_mca$quali.sup$coord),
  Dim1_Coord = round(res_mca$quali.sup$coord[, 1], 3),
  Dim1_vtest = round(res_mca$quali.sup$v.test[, 1], 2),
  Dim2_Coord = round(res_mca$quali.sup$coord[, 2], 3),
  Dim2_vtest = round(res_mca$quali.sup$v.test[, 2], 2)
)
print(sup_stats, n = 15)

# 5. Clean, Legible Biplot (Active Poles Grouped by Domain)
var_coords <- as.data.frame(res_mca$var$coord) %>%
  rownames_to_column("Category") %>%
  mutate(
    Contrib_Total = res_mca$var$contrib[, 1] + res_mca$var$contrib[, 2],
    Domain = case_when(
      str_detect(Category, "Reform|Rule|Leader|Coup")   ~ "Regime & Authority",
      str_detect(Category, "Gay")                      ~ "Personal & LGBTQ+ Autonomy",
      str_detect(Category, "Men Lead|Men Job")         ~ "Gender Hierarchy",
      str_detect(Category, "Corrupt|Welfare")          ~ "Economy & Corruption"
    )
  )

p_clean <- ggplot(var_coords, aes(x = `Dim 1`, y = `Dim 2`, label = Category)) +
  geom_vline(xintercept = 0, linetype = "dashed", color = "gray80") +
  geom_hline(yintercept = 0, linetype = "dashed", color = "gray80") +
  geom_point(aes(color = Domain, size = Contrib_Total), alpha = 0.85) +
  ggrepel::geom_text_repel(
    size = 3.6,
    max.overlaps = 30,
    box.padding = 0.35,
    point.padding = 0.3
  ) +
  scale_color_brewer(palette = "Set1") +
  theme_minimal(base_size = 12) +
  theme(
    legend.position = "bottom",
    panel.grid.minor = element_blank()
  ) +
  labs(
    title = "Refined MCA: Thai Value Dimensions (10 High-Signal Items)",
    subtitle = "Collapsed neutral categories eliminate response-style artifacts",
    x = paste0("Dimension 1 (", round(res_mca$eig[1, 2], 1), "% Inertia)"),
    y = paste0("Dimension 2 (", round(res_mca$eig[2, 2], 1), "% Inertia)"),
    color = "Domain",
    size = "Combined Contribution (%)"
  )

print(p_clean)

# Extract individual coordinates and merge with demographics
ind_coords <- as_tibble(res_mca$ind$coord[, 1:2]) %>%
  rename(dim1 = `Dim 1`, dim2 = `Dim 2`) %>%
  bind_cols(
    thai_mca_clean %>% select(Gender, Age_Group, Education, Ideology_LeftRight)
  )

# Preview distribution
p_ind <- ggplot(ind_coords, aes(x = dim1, y = dim2)) +
  geom_density_2d_filled(alpha = 0.5) +
  geom_point(aes(color = Age_Group), alpha = 0.25, size = 1) +
  geom_vline(xintercept = 0, linetype = "dashed", color = "gray50") +
  geom_hline(yintercept = 0, linetype = "dashed", color = "gray50") +
  theme_minimal() +
  labs(
    title = "Thai Population Density on MCA Value Space",
    x = "Dim 1: Traditional Agrarian vs. Cosmopolitan Modernity",
    y = "Dim 2: Regime Deference vs. Democratic Proceduralism"
  )
print(p_ind)

library(jsonlite)

# 1. Active Category Coordinates & Metrics
export_categories <- tibble::tibble(
  id = rownames(res_mca$var$coord),
  dim1 = round(res_mca$var$coord[, 1], 4),
  dim2 = round(res_mca$var$coord[, 2], 4),
  contrib_dim1 = round(res_mca$var$contrib[, 1], 2),
  contrib_dim2 = round(res_mca$var$contrib[, 2], 2),
  cos2_dim1 = round(res_mca$var$cos2[, 1], 3),
  cos2_dim2 = round(res_mca$var$cos2[, 2], 3),
  domain = case_when(
    str_detect(id, "Reform|Rule|Leader|Coup") ~ "Regime & Authority",
    str_detect(id, "Gay")                    ~ "Personal & LGBTQ+ Autonomy",
    str_detect(id, "Men Lead|Men Job")       ~ "Gender Hierarchy",
    str_detect(id, "Corrupt|Welfare")        ~ "Economy & Corruption"
  )
)

# 2. Supplementary Categories (Demographics)
export_supplementary <- tibble::tibble(
  id = rownames(res_mca$quali.sup$coord),
  dim1 = round(res_mca$quali.sup$coord[, 1], 4),
  dim2 = round(res_mca$quali.sup$coord[, 2], 4),
  vtest_dim1 = round(res_mca$quali.sup$v.test[, 1], 2),
  vtest_dim2 = round(res_mca$quali.sup$v.test[, 2], 2),
  group = case_when(
    id %in% c("Left", "Center", "Right", "No Ideology Label") ~ "Ideology",
    id %in% c("18-29", "30-49", "50+")                        ~ "Age",
    id %in% c("Male", "Female")                               ~ "Gender",
    str_detect(id, "Edu")                                     ~ "Education"
  )
)

# 3. Variance Explained (For Axis Labels)
export_variance <- list(
  dim1 = round(as.numeric(res_mca$eig[1, 2]), 2),
  dim2 = round(as.numeric(res_mca$eig[2, 2]), 2)
)

# 4. Individual Coordinates (For Respondent Scatterplot)
export_individuals <- ind_coords %>%
  mutate(
    id = paste0("respondent_", row_number()),
    dim1 = round(as.numeric(dim1), 4),
    dim2 = round(as.numeric(dim2), 4),
    gender = as.character(Gender),
    age_group = as.character(Age_Group),
    education = as.character(Education),
    ideology = as.character(Ideology_LeftRight)
  ) %>%
  select(id, dim1, dim2, gender, age_group, education, ideology)

# Combine and write to JSON
mca_payload <- list(
  variance = export_variance,
  categories = export_categories,
  supplementary = export_supplementary,
  individuals = export_individuals,
  scatterplot = list(
    x = list(
      field = "dim1",
      label = "Dim 1: Traditional Agrarian vs. Cosmopolitan Modernity"
    ),
    y = list(
      field = "dim2",
      label = "Dim 2: Regime Deference vs. Democratic Proceduralism"
    ),
    color = list(
      field = "age_group",
      label = "Age group"
    )
  )
)

write_json(mca_payload, "thai_values_mca.json", pretty = TRUE)