import type { InstrumentKind } from "./journeyInstruments";

/**
 * Journey-page content — sourced verbatim from beyondage.health/health-journeys
 * (heart-health, metabolic-health, sleep-health). Wording, diagnostics, the
 * "interventions may include" lists, the goal statements and the Common Concerns
 * Q&A are the site's own; only light punctuation/casing is normalised. Nothing
 * here is invented — per the brief, credibility is the product.
 */

export type FAQ = { q: string; a: string };
export type Related = { title: string; slug: string; kind: InstrumentKind };

export type JourneyData = {
  slug: string;
  kind: InstrumentKind;
  index: string; // "01" of "03"
  title: string;
  tagline: string;
  lede: string;
  stat: { value: string; label: string };
  instrument: { chan: string; unit: string; caption: string };
  intro: string;
  consultations: string[];
  diagnostics: string[];
  monitoring?: string[];
  interventions: string[];
  goal: string;
  faqs: FAQ[];
  related: Related[];
};

const HEART: JourneyData = {
  slug: "heart-health",
  kind: "cardiac",
  index: "01",
  title: "Heart Health",
  tagline: "Science-backed evidence to keep your heart healthy.",
  lede:
    "Advanced cardiovascular screening, precision biomarkers and personalised interventions — to detect and prevent heart disease decades before symptoms appear.",
  stat: { value: "1 in 4", label: "Indians die of heart attack or stroke." },
  instrument: {
    chan: "ECG · Lead II",
    unit: "mV",
    caption: "Illustrative Lead-II trace — the electrical signal a cardiac work-up reads.",
  },
  intro:
    "A complete cardiovascular work-up — consultations, advanced diagnostics and a personalised plan — coordinated by our physicians and health coaches. Heart disease often develops silently, so we read the signal early, and act.",
  consultations: [
    "Discovery Consultation",
    "Questionnaire / Risk Score Assessment",
    "Lifestyle / Longevity Consultation",
    "Follow-up — Longevity consult (each month end)",
    "Cardiology Consultation",
    "Nutrition Consultation",
    "Follow-up — Nutritionist",
    "Musculoskeletal / Fitness Assessment",
    "Emotional Wellbeing Consultation",
    "Sleep Assessment Consultation",
    "Final consultation with the lifestyle & longevity physician",
    "Coordinated specialist / journey referral when needed",
  ],
  diagnostics: [
    "Advanced BA Biomarker Panel",
    "ECG",
    "ECHO",
    "CPET (without ECHO)",
    "Low Dose CT Coronary Calcium Score",
    "AI-aided CT Angio",
    "Vascular Testing — Arterial & Venous Leg Doppler, Carotid Intima Thickness",
    "AI-aided Body Composition Analysis (DEXA)",
    "Focused Genome — Genetic Testing",
  ],
  monitoring: ["Personalized intervention plan", "Monitoring and follow-up with Health Coach"],
  interventions: [
    "Targeted lifestyle changes",
    "Personalised nutrition and fitness plans",
    "Sleep optimisation and stress management",
    "Medications, supplements, and anti-inflammatory support",
    "Correcting key risk markers — like blood pressure, blood sugar, and other cardio-metabolic factors",
  ],
  goal:
    "The goal is simple: to strengthen your heart health today and sustain it for decades to come. You are closely guided by our doctors and health coaches, ensuring continuous monitoring and the best possible outcomes. No generic protocols — everything is tailored to you.",
  faqs: [
    {
      q: "What are the earliest warning signs that my heart may not be healthy?",
      a: "Early warning signs may include unexplained fatigue, shortness of breath during routine activity, chest discomfort, dizziness, palpitations, or reduced exercise tolerance. However, heart disease often develops silently without symptoms.",
    },
    {
      q: "How often should I get my heart checked if I feel perfectly healthy?",
      a: "Even healthy adults should undergo routine heart checks. Blood pressure should be checked annually if normal and more frequently if high. Blood sugar and cholesterol levels should be checked every 2–4 years if normal, and 3–6 monthly if abnormal, or if there are other risk factors.",
    },
    {
      q: "What are the biggest lifestyle factors that damage heart health?",
      a: "Smoking, unhealthy diet, physical inactivity, excess body weight, uncontrolled blood pressure, high cholesterol, and diabetes are the most important correctable risk factors. Addressing them early can dramatically reduce risk of heart disease.",
    },
    {
      q: "What is the single most powerful habit for protecting my heart?",
      a: "That would have to be regular physical activity. At least 150 minutes of moderate aerobic exercise per week and strength training twice a week helps improve circulation, lower blood pressure, regulate cholesterol, and strengthen the heart muscle.",
    },
    {
      q: "What kind of diet is best for your heart health?",
      a: "A heart-healthy diet incorporates vegetables, fruits, whole grains, legumes, nuts, fish, and healthy fats such as olive oil. Evidence-based dietary patterns like the Mediterranean or DASH diet are the best. Limiting processed foods, excess salt, and refined sugars is equally important.",
    },
  ],
  related: [
    { title: "Metabolic Health", slug: "metabolic-health", kind: "metabolic" },
    { title: "Sleep Health", slug: "sleep-health", kind: "sleep" },
  ],
};

const METABOLIC: JourneyData = {
  slug: "metabolic-health",
  kind: "metabolic",
  index: "02",
  title: "Metabolic Health",
  tagline: "Most health problems begin with metabolic dysfunction — found early, it can be reversed.",
  lede:
    "Precision metabolic testing and targeted lifestyle interventions that restore insulin sensitivity, improve energy metabolism, and prevent chronic disease.",
  stat: {
    value: "18.5%",
    label: "of urban Indians over 15 have diabetes — and only 1 in 4 are aware of it.",
  },
  instrument: {
    chan: "Glucose · Response",
    unit: "mg/dL",
    caption: "Illustrative post-meal glucose response — read against the normal range.",
  },
  intro:
    "Latest research says the majority of your health problems are a result of metabolic dysfunction. Detailed insights from our top physicians on optimising metabolic health — weight management, cholesterol, blood pressure, and the prevention or early detection of diabetes.",
  consultations: [
    "Discovery Consultation",
    "Questionnaire / Risk Score Assessment",
    "Lifestyle / Longevity Consultation",
    "Follow-up — Longevity consult (each month end)",
    "Endocrinology Consultation",
    "Cardiology Consultation",
    "Liver Consultation",
    "Nutrition Consultation",
    "Follow-up — Nutritionist",
    "Detailed Musculoskeletal (Joint, Mobility & Muscle) Assessment",
    "Emotional Wellbeing Consultation",
    "Sleep Assessment Consultation",
    "Follow-up consultation with the lifestyle & longevity physician",
    "Coordinated specialist / journey referral when needed",
  ],
  diagnostics: [
    "Advanced BA Biomarkers Panel",
    "Low Dose CT Coronary Calcium Score",
    "AI-aided CT Coronary Angio",
    "AI-aided Body Composition Analysis",
    "Vascular Testing",
    "Autonomic Nervous System Analysis",
    "Diabetes Neuropathy Screening",
    "Retinal Screening",
  ],
  monitoring: ["Personalized intervention plan", "Monitoring and follow-up with Health Coach"],
  interventions: [
    "Targeted lifestyle changes",
    "Weight optimisation",
    "Personalised nutrition and fitness plans",
    "Medications, supplements, and anti-inflammatory support (when required)",
    "Control of blood pressure, blood sugar, lipids, metabolic risk factors and liver steatosis (fatty liver)",
  ],
  goal:
    "Reprogram your metabolism to restore energy, strengthen immunity, optimise fat loss, extend healthspan, and prevent chronic disease through precision diagnostics and personalised interventions. You are closely guided by our doctors and health coaches, ensuring continuous monitoring and the best possible outcomes.",
  faqs: [
    {
      q: "What is metabolic syndrome?",
      a: "Metabolic syndrome is a cluster of metabolic abnormalities that significantly increase the risk of heart disease, stroke, and type 2 diabetes. It is diagnosed when a person has three or more of the following: abdominal obesity, high blood pressure, high blood sugar, elevated triglycerides, or low HDL (“good”) cholesterol.",
    },
    {
      q: "What is insulin resistance?",
      a: "Insulin resistance occurs when the body’s cells stop responding effectively to insulin, the hormone that helps move glucose from the bloodstream into cells. As a result, blood sugar and insulin levels rise. This condition is a major driver of type 2 diabetes and metabolic syndrome.",
    },
    {
      q: "Can metabolic syndrome be reversed?",
      a: "Yes, in many cases metabolic syndrome can be improved or even reversed with targeted lifestyle changes. Weight reduction, regular physical activity, improved nutrition, better sleep, and stress management can significantly improve blood sugar, blood pressure, and lipid levels. Early intervention greatly reduces long-term health risks.",
    },
    {
      q: "Is abdominal fat more dangerous than general weight gain?",
      a: "Fat stored around the abdomen, known as visceral fat, surrounds internal organs and releases inflammatory substances that disrupt metabolism. This fat strongly contributes to insulin resistance, abnormal cholesterol levels, and cardiovascular disease risk. Reducing visceral fat is an important goal in metabolic health programs.",
    },
    {
      q: "What causes metabolic syndrome?",
      a: "Metabolic syndrome develops from a combination of excess abdominal fat, insulin resistance, poor diet, sedentary lifestyle, and genetic susceptibility. These factors disrupt the body’s ability to regulate blood sugar, cholesterol, and blood pressure.",
    },
  ],
  related: [
    { title: "Heart Health", slug: "heart-health", kind: "cardiac" },
    { title: "Sleep Health", slug: "sleep-health", kind: "sleep" },
  ],
};

const SLEEP: JourneyData = {
  slug: "sleep-health",
  kind: "sleep",
  index: "03",
  title: "Sleep Health",
  tagline: "Science-backed guidance on improving your quality and duration of sleep and recovery.",
  lede:
    "Comprehensive sleep diagnostics and circadian-rhythm optimisation — to restore deep sleep, and support brain and metabolic health.",
  stat: { value: "60%", label: "of people have inadequate sleep." },
  instrument: {
    chan: "Hypnogram · 7 h",
    unit: "stage",
    caption: "Illustrative overnight hypnogram — the sleep architecture a study maps.",
  },
  intro:
    "Comprehensive sleep diagnostics, and circadian-rhythm and sleep-cycle optimisation strategies to restore deep sleep, and support brain and metabolic health — supported by regular reviews of your sleep logs, wearable data and symptoms.",
  consultations: [
    "Discovery Consultation",
    "Questionnaire / Risk Score Assessment",
    "Lifestyle / Longevity Consultation",
    "Follow-up — Longevity consult (each month end)",
    "Sleep Assessment Consultation",
    "Nutrition Consultation",
    "Follow-up — Nutritionist",
    "Emotional Wellbeing Consultation",
    "Detailed Musculoskeletal (Joint, Mobility & Muscle) Assessment",
    "Follow-up consultation with the lifestyle & longevity physician",
    "Coordinated specialist / journey referral when needed",
  ],
  diagnostics: [
    "Advanced BA Biomarkers Sleep Panel — Level 1",
    "Advanced BA Biomarkers Sleep Panel — Level 2",
    "Reaction Time — Psychomotor Vigilance Testing",
    "Psychology Assessment",
    "Polysomnography — Level 2, Level 3, Level 4 (as indicated)",
    "ENT assessment (if indicated)",
  ],
  monitoring: [
    "Sleep diary daily (bedtime, wake time, SOL, WASO, naps, caffeine/alcohol)",
    "Wearable device for sleep duration, variability, HR, HRV (if available)",
    "Home BP monitoring (if hypertensive)",
  ],
  interventions: [
    "Targeted lifestyle changes to optimise your sleep–wake schedule, light exposure, and evening routines",
    "Personalised nutrition",
    "Movement strategies that support circadian alignment and restorative sleep",
    "Tools for stress reduction and nervous-system regulation (breathing techniques, mindfulness, or CBT-I–informed approaches)",
    "Medications, supplements, and other anti-inflammatory sleep-supportive therapies when clinically indicated",
  ],
  goal:
    "The goal is simple: to help you fall asleep more easily, stay asleep through the night, wake feeling restored, and sustain healthy sleep patterns for years to come. You are closely supported by our clinicians and health coaches, with regular reviews of your sleep logs, wearable data, and symptoms. No generic protocols — every element of your sleep-wellness journey is tailored to you.",
  faqs: [
    {
      q: "How many hours of sleep do adults actually need?",
      a: "Most healthy adults require 7–9 hours of sleep per night for optimal physical and mental health. Regularly sleeping less than seven hours has been linked to increased risks of obesity, diabetes, cardiovascular disease, and depression.",
    },
    {
      q: "Why is sleep so important for overall health and longevity?",
      a: "Sleep allows the body and brain to recover, regulate hormones, consolidate memory, and repair tissues. High-quality sleep supports immune function, metabolic balance, and cardiovascular health. Long-term studies suggest individuals with healthy sleep patterns may live several years longer than those with chronically poor sleep.",
    },
    {
      q: "What is the circadian rhythm and why does it matter?",
      a: "The circadian rhythm is the body’s internal biological clock that regulates sleep, hormone release, metabolism, and alertness. Disrupting this rhythm through irregular sleep schedules, shift work, or excessive late-night screen exposure can impair sleep and increase long-term health risks.",
    },
    {
      q: "What is insomnia and when should I be concerned?",
      a: "Insomnia refers to difficulty falling asleep, staying asleep, or waking too early despite adequate opportunity for sleep. Occasional insomnia is common, but persistent symptoms lasting several weeks may require evaluation. Chronic insomnia can affect mood, concentration, and overall health.",
    },
    {
      q: "What is sleep apnea and why is it dangerous?",
      a: "Sleep apnea is a condition in which breathing repeatedly stops and starts during sleep. It often causes loud snoring, interrupted sleep, and excessive daytime fatigue. Untreated sleep apnea increases the risk of hypertension, heart disease, stroke, and metabolic disorders.",
    },
  ],
  related: [
    { title: "Heart Health", slug: "heart-health", kind: "cardiac" },
    { title: "Metabolic Health", slug: "metabolic-health", kind: "metabolic" },
  ],
};

export const JOURNEYS: Record<string, JourneyData> = {
  "heart-health": HEART,
  "metabolic-health": METABOLIC,
  "sleep-health": SLEEP,
};
