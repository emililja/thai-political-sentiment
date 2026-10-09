# 🇹🇭 Thailand Sociocultural Value Dimensions
### Research Report & Interactive MCA Infographic | By Emily Suwanasing
### World Values Survey (Wave 7 Thailand Sample)

An interactive data journalism and political sociology infographic built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**, ready for deployment to **GitHub Pages**.

Based on a refined **Multiple Correspondence Analysis (MCA)** of the **World Values Survey (Wave 7)** representative sample for Thailand (N ≈ 1,500).

---

## 📌 Executive Summary & Key Revelations

1. **The Western "Left vs. Right" Myth in Thailand**:
   - Over 40% of Thais do not identify with Western "Left" or "Right" labels.
   - Projected onto the MCA plane, the **"No Ideology Label"** group sits strongly at **+0.268 on Dimension 1** with an exceptional **v-test score of +5.27** ($p < 0.0001$).
   - This non-ideological majority clusters alongside anti-corruption scrutiny and LGBTQ+ acceptance, while self-described "Left" and "Right" respondents both lean toward traditional and patriarchal positions.

2. **The Authoritarian & Militarism Fault Line (Dimension 2)**:
   - Dimension 2 (13.31% inertia) is overwhelmingly dominated by attitudes toward authority.
   - Rejection of strongman rule (`Leader: Bad`, +1.982 coord) and military rule (`Army Rule: Bad`, +0.785 coord) contribute **38.3% of total variance** on this dimension, counter-balanced by pro-military sentiment at the bottom.

3. **LGBTQ+ Equality & Anti-Corruption Form a Single Modernity Axis**:
   - Dimension 1 (14.99% inertia) unifies personal autonomy (`Gay: Justifiable`, 15.4% contrib) and institutional scrutiny (`Corrupt: High`, 13.2% contrib).
   - This demonstrates that in contemporary Thailand, the demand for governance transparency is culturally linked with sexual and gender egalitarianism.

4. **The Generational & Education Cleavage**:
   - Youth (ages 18–29) and university-educated citizens (`Edu: High`, v-test +3.64) pull firmly toward Quadrant 1 (Democratic Reform & Progressive Autonomy).
   - Primary-educated cohorts (`Edu: Low`, v-test -5.79) pull toward the patriarchal, traditional pole.

---

## 🧭 The 4 Political Quadrants

| Quadrant | Name | Core Attributes |
| :--- | :--- | :--- |
| **Q1 (Top-Right)** | **Democratic Reform & Progressive Autonomy** | Anti-military governance, rejection of strongman rule, gender equality, LGBTQ+ rights, acute corruption awareness. |
| **Q2 (Top-Left)** | **Anti-Authoritarian Traditionalism** | Demands radical systemic overhaul and individual self-reliance, while retaining traditional patriarchal and moral conservative views. |
| **Q3 (Bottom-Left)** | **Patriarchal Paternalism & Order** | Endorsement of military governance and strongman authority as stabilizing forces, accompanied by traditional male leadership norms. |
| **Q4 (Bottom-Right)** | **Paternalist Modernizers & Welfare Seekers** | Open to social equality and LGBTQ+ parenting, demands robust state welfare, but leans toward gradual institutional reform. |

---

## 🚀 Features

- **Interactive 2D MCA Map (Biplot)**:
  - Vector rendering via SVG with coordinate axes and inertia metrics.
  - Quadrant background shading and descriptive annotations.
  - Dynamic bubble sizing by **Combined Contribution (%)** or **Cos² Quality of Representation**.
  - **Opposing Vectors**: Toggle dashed connector lines linking opposing attitudes (e.g. `Army Rule: Good` ↔ `Army Rule: Bad`).
  - **Demographic Projections**: Toggle and filter demographic anchors (Ideology, Age, Gender, Education) with projection rays to origin.
  - Responsive hover tooltips and interactive point selection.
- **Guided Story Walkthrough ("4 Core Revelations")**:
  - Step-by-step narrative tour explaining the sociological context and spotlighting relevant nodes.
- **Driver Analytics**:
  - Dimension 1 & Dimension 2 ranked contribution bar charts with average cutoff threshold ($100 / 21 = 4.76\%$).
  - Cos² quality of representation matrix.
  - Demographic $V$-Test table with statistical significance indicators ($|v| > 1.96, p < 0.05$).
- **Data Table & Export**:
  - Searchable, sortable table of all 21 active categories and 14 supplementary groups.
  - Export data directly to **CSV**.
  - Export biplot map to **SVG** or **PNG**.
- **Research Methodology Modal**:
  - Full documentation of WVS Wave 7, dichotomization rationale to remove neutral fence-sitter bias, and FactoMineR mathematics.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🌐 GitHub Pages Deployment

The repository includes a ready-to-run GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Quick Setup:
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Thai political sentiment MCA infographic"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Every commit to `main` will automatically build and publish the infographic to:
   `https://<your-username>.github.io/<your-repo-name>/`

> **Note on Base Path**: `vite.config.ts` is configured with `base: './'`, ensuring that all assets load reliably without path issues on any repository name or custom domain.

---

## 📊 Data & Analysis Provenance

- **Original Data**: World Values Survey (WVS) Wave 7 (Thailand Representative Sample, $N \approx 1,500$).
- **R Analytics Script**: [`politics_analytics.R`](politics_analytics.R) (uses `FactoMineR`, `haven`, `factoextra`, `jsonlite`).
- **Payload**: [`thai_values_mca.json`](thai_values_mca.json).

