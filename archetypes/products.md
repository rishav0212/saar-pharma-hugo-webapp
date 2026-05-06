---
# 1. SEO & SEARCH METADATA
title: "{{ replace .Name "-" " " | title }} | Top Manufacturer"
meta_title: "{{ replace .Name "-" " " | title }} Manufacturer & Supplier India | SAAR Biotech"
slug: "{{ .Name }}"
meta_description: "WHO-GMP certified manufacturer of {{ replace .Name "-" " " | title }}. Premium third-party contract manufacturing services from Baddi, India."
keywords: ["{{ replace .Name "-" " " | title }}", "Third Party Manufacturing", "Pharma Manufacturer India"]
description: "" # Concise marketing blurb for the product card (Max 120 chars)

# 2. CORE PRODUCT DATA
approved_name: "" # e.g., Aceclofenac IP / BP / USP
categories: ["Suspensions", "Antibiotics"] # First item = Main Badge, Second = Sub Badge

# 3. CLINICAL DATA & PRESENTATION
therapeutic_class: ["Antibiotic"]
dosage_form: ""      # e.g., "Oral Suspension", "Tablet"
drug_form: ""        # e.g., "Liquid", "Solid"

# BACKEND MATCHING (For Related Products Engine)
compositions: []     # Base molecules only: e.g., ["azithromycin"]

# FRONTEND DISPLAY (Unified Presentation)
presentation:
  heading: ""        # e.g., "SUSPENSION PRESENTATION:"
  base_unit: ""      # e.g., "Each 5 ml contains:"
  ingredients:
    - salt: ""       # e.g., "Azithromycin Dihydrate IP"
      strength: ""   # e.g., "250 mg"

# 4. LOGISTICS & MANUFACTURING
pack_sizes: ["1x10", "10x10"] # List all available dimensions
manufacturing_status: "Available for CMO" # "Available for CMO", "In Development", "Proprietary"
quality_standards: "WHO-GMP / ISO 9001:2015"
storage_conditions: "" 
shelf_life: ""        

# 5. CUSTOM SPECS (Unlimited Extra Fields)
custom_specs:
  - label: "MOQ"
    value: "1000 Units"

# 6. DUAL-LAYER FAQ
faq_clinical:
  - question: "What is the primary clinical use of this formulation?"
    answer: "This product is primarily used for [Clinical Indication]."

faq_b2b:
  - question: "What is the MOQ for this specific formulation?"
    answer: "The Minimum Order Quantity varies based on the packing size and category."

# 7. GALLERY
images:
  - "{{ .Name }}.webp"
---

## Description & Therapeutic Class
<!-- High-level clinical overview and primary use cases -->

## The Saar Biotech Advantage
<!-- Why partner with Saar Biotech for this specific formulation (e.g., precise manufacturing, API stability) -->
- **Advantage 1**: Detail here.
- **Advantage 2**: Detail here.

## Key Indications & Usage
<!-- Bullet points of clinical uses and conditions treated -->
- **Indication 1**: Detail here.
- **Indication 2**: Detail here.

## Mechanism of Action (MOA)
<!-- How the molecule works pharmacologically -->

## Pharmacokinetics & Bioavailability
<!-- Details on absorption, distribution, and elimination -->

## Storage & Reconstitution Intelligence
<!-- Specific handling and storage instructions for B2B partners -->

## Quality Control & Compliance
<!-- Specific QC tests performed (e.g., Dissolution, Assay, MLT) -->

## Side Effects & Safety Profile
<!-- Common adverse effects and contraindications -->

---
*For B2B manufacturing enquiries, third-party contracts, or to request a full technical dossier for {{ replace .Name "-" " " | title }}, please use the enquiry form below.*
