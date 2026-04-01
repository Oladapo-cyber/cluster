// Centralized product catalog - single source of truth for all pages
// Update this file and all pages will auto-sync

import cardiacHealthImage from '../assets/Cardiac health.avif';
import chlamydiaImage from '../assets/Chlamydia.avif';
import diabetesImage from '../assets/diabetes.avif';
import gonorrheaImage from '../assets/Gonorrhea.avif';
import hepatitisBImage from '../assets/Hepatitis B.avif';
import hivImage from '../assets/hiv.avif';
import hpvAntigenImage from '../assets/HPV Antigen.avif';
import kidneyImage from '../assets/kidney health test.jpeg';
import malariaImage from '../assets/Malaria.avif';
import maleFertilityImage from '../assets/Male Fertility.avif';
import menopauseImage from '../assets/Menopause.avif';
import ovulationImage from '../assets/Ovulation.avif';
import pregnancyImage from '../assets/pregnancy.avif';
import prostateImage from '../assets/prostate.jpeg';
import stomachUlcerImage from '../assets/Stomach Ulcer.avif';
import syphilisImage from '../assets/Syphilis.avif';
import typhoidImage from '../assets/typhoid.avif';
import urinaryTractInfectionImage from '../assets/Urinary Tract Infection.avif';
import vaginalPhInfectionImage from '../assets/Vaginal pH Infection.avif';

export const CATEGORIES = [
  'All',
  'General Health',
  'Sexual Health',
  'Men',
  'Women',
  'Organ Health'
] as const;

export type Category = typeof CATEGORIES[number];

export interface Product {
  id: string; // slug
  title: string;
  price: string;
  description: string; // Short description for cards
  fullDescription: string; // Full description for details page
  categories: Category[];
  available: boolean;
  image: string; // Path to product image
}

// Complete product catalog extracted from design requirements
export const PRODUCTS: Product[] = [
  // General Health Category
  {
    id: 'diabetes',
    title: 'Diabetes',
    price: '₦17,000',
    description: 'An at-home test that measures your average blood sugar (glucose) levels over the past 2-3 months.',
    fullDescription: 'An at-home test that measures your average blood sugar levels over the past 2-3 months. Perfect for monitoring diabetes or checking if you\'re at risk. Simple finger-prick blood test with clear, confidential results.',
    categories: ['General Health'],
    available: true,
    image: diabetesImage
  },
  {
    id: 'stomach-ulcer',
    title: 'Stomach Ulcer',
    price: '₦23,000',
    description: 'An at-home test to detect an active Helicobacter pylori (H. pylori) infection from a stool sample.',
    fullDescription: 'Detects H. pylori bacteria, the primary cause of stomach ulcers and gastritis. Quick stool test that provides accurate results. Essential for anyone experiencing persistent stomach pain or digestive issues.',
    categories: ['General Health', 'Organ Health'],
    available: true,
    image: stomachUlcerImage
  },
  {
    id: 'hepatitis-b',
    title: 'Hepatitis B',
    price: '₦9,900',
    description: 'An at-home rapid test that checks for Hepatitis B Surface Antigen (HBsAg) in a blood sample.',
    fullDescription: 'A rapid blood test to detect Hepatitis B surface antigens. Early detection is crucial for effective treatment and preventing liver damage. Confidential at-home testing with clear instructions and fast results.',
    categories: ['Sexual Health', 'Organ Health'],
    available: true,
    image: hepatitisBImage
  },
  {
    id: 'cardiac-health',
    title: 'Cardiac health',
    price: '₦25,000',
    description: 'A rapid blood test that detects troponin, a protein released into the bloodstream when the heart muscle is damaged.',
    fullDescription: 'A comprehensive cardiac marker test that detects troponin levels to assess heart health and risk of heart attack. Essential for those with chest pain, family history of heart disease, or cardiovascular risk factors.',
    categories: ['General Health', 'Organ Health'],
    available: true,
    image: cardiacHealthImage
  },
  {
    id: 'typhoid',
    title: 'Typhoid',
    price: '₦9,680',
    description: 'The typhoid test checks for infection with Salmonella enterica serotype Typhi.',
    fullDescription: 'Rapid test for detecting Salmonella typhi antibodies associated with typhoid fever. Important for anyone experiencing prolonged fever, headaches, or abdominal discomfort, especially after consuming potentially contaminated food or water.',
    categories: ['General Health'],
    available: true,
    image: typhoidImage
  },
  {
    id: 'malaria',
    title: 'Malaria',
    price: '₦9,570',
    description: 'Stay ahead of malaria with a fast at-home test that delivers clear results in minutes.',
    fullDescription: 'A rapid at-home malaria test that detects P.f/p-vivax parasites in blood samples. Quick results in minutes for early diagnosis and treatment. Essential for travelers or those in malaria-endemic regions.',
    categories: ['General Health'],
    available: true,
    image: malariaImage
  },

  // Sexual Health Category
  {
    id: 'hiv',
    title: 'HIV',
    price: '₦9,900',
    description: 'A confidential, at-home test that checks for HIV-1 and HIV-2 antibodies using a small drop of blood.',
    fullDescription: 'A confidential at-home HIV test for detecting antibodies. Early detection enables timely treatment and better health outcomes. Simple finger-prick blood test with clear, private results and support resources.',
    categories: ['Sexual Health'],
    available: true,
    image: hivImage
  },
  {
    id: 'syphilis',
    title: 'Syphilis',
    price: '₦19,000',
    description: 'A confidential blood test that checks for antibodies to Treponema pallidum, the bacterium that causes syphilis.',
    fullDescription: 'A rapid test for detecting Syphilis antibodies. Early detection is crucial for effective treatment. Confidential at-home blood test with clear instructions and fast, accurate results.',
    categories: ['Sexual Health'],
    available: true,
    image: syphilisImage
  },
  {
    id: 'chlamydia',
    title: 'Chlamydia',
    price: '₦19,000',
    description: 'A confidential at-home test to screen for Chlamydia, one of the most common sexually transmitted infections.',
    fullDescription: 'A simple test for detecting Chlamydia infection, one of the most common STIs. Easy urine sample collection with confidential results. Early detection prevents complications and transmission.',
    categories: ['Sexual Health'],
    available: true,
    image: chlamydiaImage
  },
  {
    id: 'gonorrhea',
    title: 'Gonorrhea',
    price: '₦9,900',
    description: 'Take control of your sexual health with our private and simple At-Home Gonorrhea Test Kit.',
    fullDescription: 'Take control of your sexual health with our private and simple At-Home Gonorrhea Test Kit. This discreet test checks for the bacteria Neisseria gonorrhoeae using an easy-to-collect urine sample. Get confidential, accurate results quickly and take the first step toward peace of mind and proper care.',
    categories: ['Sexual Health'],
    available: true,
    image: gonorrheaImage
  },

  // Men Category
  {
    id: 'male-fertility',
    title: 'Male Fertility',
    price: '₦22,000',
    description: 'An at-home self-test that determines sperm count from a semen sample, providing an indicator of male fertility.',
    fullDescription: 'An at-home self-test that determines sperm count from a semen sample, providing an indicator of male fertility. Ideal for those concerned about reproductive health or trying to conceive. Comprehensive results with expert guidance.',
    categories: ['Men'],
    available: true,
    image: maleFertilityImage
  },
  {
    id: 'prostate',
    title: 'Prostate',
    price: '₦30,000',
    description: 'Take charge of your health with our Prostate-Specific Antigen (PSA) Rapid Test.',
    fullDescription: 'Take charge of your health with our Prostate-Specific Antigen (PSA) Rapid Test. This professional-grade test screens for potential prostate health issues. Important for men over 40 or those with family history of prostate concerns.',
    categories: ['Men', 'Organ Health'],
    available: true,
    image: prostateImage
  },

  // Women Category
  {
    id: 'urinary-tract-infection',
    title: 'Urinary Tract Infection',
    price: '₦25,000',
    description: 'UTIs are among the most common types of infections and affect the urinary tract, including the bladder.',
    fullDescription: 'Detects bacterial infections in the urinary tract. Quick urine test that identifies common UTI-causing bacteria. Perfect for those experiencing burning during urination, frequent urges, or cloudy urine.',
    categories: ['General Health', 'Women', 'Organ Health'],
    available: true,
    image: urinaryTractInfectionImage
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy',
    price: '₦9,570',
    description: 'A quick and easy at-home urine test that detects the pregnancy hormone, hCG, with over 99% accuracy.',
    fullDescription: 'A reliable at-home pregnancy test for early detection of hCG hormone in urine. Provides accurate results as early as the first day of a missed period. Simple to use with clear, easy-to-read results.',
    categories: ['Women'],
    available: true,
    image: pregnancyImage
  },
  {
    id: 'ovulation',
    title: 'Ovulation',
    price: '₦9,900',
    description: 'Quick and reliable home pregnancy test with over 99% accuracy, results in just minutes.',
    fullDescription: 'Tracks luteinizing hormone (LH) surges to identify your most fertile days. Ideal for those trying to conceive or understanding their cycle. Simple urine test with precise timing indicators.',
    categories: ['Women'],
    available: true,
    image: ovulationImage
  },
  {
    id: 'hpv-antigen',
    title: 'HPV Antigen',
    price: '₦28,000',
    description: 'The HPV (Human Papillomavirus) test checks for infection with high-risk HPV types.',
    fullDescription: 'The HPV (Human Papillomavirus) test checks for infection with high-risk HPV types that are linked to cervical cancer. Early detection and monitoring is essential. Confidential at-home cervical swab test.',
    categories: ['Women'],
    available: true,
    image: hpvAntigenImage
  },
  {
    id: 'menopause',
    title: 'Menopause',
    price: '₦22,000',
    description: 'An at-home urine test that helps determine if you have entered menopause or perimenopause.',
    fullDescription: 'Hormone level test to confirm menopausal status. Non-invasive urine-based test that measures FSH levels to determine menopausal stage. Helpful for understanding hormonal changes during midlife transition.',
    categories: [],
    available: true,
    image: menopauseImage
  },
  {
    id: 'vaginal-ph-infection',
    title: 'Vaginal pH Infection',
    price: '₦9,900',
    description: 'An easy-to-use at-home swab test that helps diagnose common vaginal infections.',
    fullDescription: 'Tests for vaginal pH imbalance and potential infections like bacterial vaginosis or yeast infections. Essential for women experiencing itching, unusual discharge, or odor. Quick, discreet at-home testing.',
    categories: ['General Health', 'Women'],
    available: true,
    image: vaginalPhInfectionImage
  },

  // Organ Health Category
  {
    id: 'kidney',
    title: 'Kidney',
    price: '₦25,000',
    description: 'Protect your kidneys before symptoms start. Our Urine Albumin Rapid Test detects trace amounts of protein.',
    fullDescription: 'Comprehensive kidney function test that detects albumin in urine. Early detection of kidney issues enables timely intervention. Important for those with diabetes, hypertension, or family history of kidney disease.',
    categories: ['Organ Health'],
    available: true,
    image: kidneyImage
  }
];

/**
 * Get all products for a specific category
 * @param category - The category to filter by (use 'All' to get all products)
 */
export const getProductsByCategory = (category: Category): Product[] => {
  if (category === 'All') {
    return PRODUCTS;
  }
  return PRODUCTS.filter(product => product.categories.includes(category));
};

/**
 * Find a product by its slug/id
 */
export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(product => product.id === id);
};

/**
 * Search products by title or description
 */
export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return PRODUCTS.filter(
    product =>
      product.title.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.fullDescription.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Filter products by multiple criteria
 */
export const filterProducts = (
  query: string,
  category: Category
): Product[] => {
  let results = PRODUCTS;

  // Apply category filter
  if (category !== 'All') {
    results = results.filter(product => product.categories.includes(category));
  }

  // Apply search filter
  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      product =>
        product.title.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery)
    );
  }

  return results;
};
