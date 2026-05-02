---
# 1. SEO & SEARCH METADATA
title: "{{ replace .Name "-" " " | title }} | Top Manufacturer"
meta_title: "{{ replace .Name "-" " " | title }} Manufacturer & Supplier India | SAAR Biotech"
slug: "{{ .Name }}"
meta_description: "WHO-GMP certified manufacturer of {{ replace .Name "-" " " | title }}. Premium third-party contract manufacturing services from Baddi, India."
keywords: ["{{ replace .Name "-" " " | title }}", "Third Party Manufacturing", "Pharma Manufacturer India"]
description: "" # Concise marketing blurb for the product card (Max 120 chars)

# 2. CORE PRODUCT DATA
product_name: "{{ replace .Name "-" " " | title }}"
approved_name: "" # e.g., Aceclofenac IP / BP / USP
categories: ["Suspensions", "Antibiotics"] # First item = Main Badge, Second = Sub Badge

# 3. CLINICAL DATA (Visible in Info Panel)
therapeutic_class: ["Antibiotic"] # e.g., ["Analgesic", "Antipyretic"]
dosage_form: ""      # Physical form (e.g., "Tablet", "Hard Gelatin Capsule")
drug_form: ""        # Optional synonym (e.g., "Liquid", "Ointment")
composition: ""      # Detailed formula (e.g., "Each 5ml contains...")
presentation: ""      # Pack appearance description

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

## Description
<!-- High-level clinical overview -->

## Key Indications & Usage
<!-- Bullet points of clinical uses -->

## Mechanism of Action
<!-- How the molecule works -->

## B2B Manufacturing Conclusion
<!-- Why partner with Saar Biotech for this specific product -->

---
**Looking for Contract Manufacturing for {{ replace .Name "-" " " | title }}?**  
[Start your journey with Saar Biotech — Quote Now](/#enquiry-form)
