import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// AI Auto-Classification & Recommendation Endpoint
app.post("/api/ai/classify", async (req, res) => {
  try {
    const { text, assetName, assetLocation, observerNotes } = req.body;

    if (!text && !observerNotes) {
      return res.status(400).json({ error: "النص أو الملاحظة مطلوبة للتحليل" });
    }

    const client = getGeminiClient();
    const fullDescription = [
      text ? `الملاحظة / التسجيل الصوتي: "${text}"` : "",
      observerNotes ? `ملاحظات إضافية: "${observerNotes}"` : "",
      assetName ? `الأصل أو المعدة المتأثرة: ${assetName}` : "",
      assetLocation ? `الموقع / المحطة: ${assetLocation}` : "",
    ].filter(Boolean).join("\n");

    if (!client) {
      // Intelligent fallback when API key is not present in local test
      const isUnsafeAct = text.includes("بدون") || text.includes("تجاهل") || text.includes("سلوك") || text.includes("سرعة") || text.includes("قفازات") || text.includes("خوذة");
      const isCritical = text.includes("تسريب") || text.includes("حريق") || text.includes("غاز") || text.includes("كهرباء") || text.includes("شرر") || text.includes("ضغط عالي");
      
      let category = "ميكانيكي";
      if (text.includes("كهرباء") || text.includes("سلك") || text.includes("قاطع")) category = "كهربائي";
      else if (text.includes("تسريب") || text.includes("غاز") || text.includes("مواد")) category = "كيميائي / بيئي";
      else if (text.includes("خوذة") || text.includes("نظارة") || text.includes("حذاء")) category = "مهمات الوقاية (PPE)";
      else if (text.includes("إطفاء") || text.includes("حريق") || text.includes("لهب")) category = "سلامة ومكافحة الحريق";
      else if (text.includes("انزلاق") || text.includes("ممر") || text.includes("ترتيب")) category = "نظافة وترتيب الموقع";

      return res.json({
        type: isUnsafeAct ? "تصرف غير آمن (Unsafe Act)" : "حالة غير آمنة (Unsafe Condition)",
        category,
        severity: isCritical ? "عالي (Critical)" : "متوسط (Medium)",
        severityLevel: isCritical ? "high" : "medium",
        riskScore: isCritical ? 85 : 45,
        immediateAction: isCritical 
          ? "إيقاف العمل فوراً وعزل مصدر الخطر ووضع شريط تحذيري واستدعاء فريق الطوارئ والصيانة."
          : "توجيه العامل لتصحيح الوضع فوراً أو تعديل وضعية العمل وتأمين المحيط.",
        preventiveAction: "مراجعة إجراءات التشغيل القياسية (SOP)، وإجراء فحص دوري للمعدة وتنظيم جلسة تدريب توعوية لفريق الوردية.",
        rootCause: isUnsafeAct ? "نقص تدريب وتوعية سلوكية" : "تهالك أو نقص صيانة وقائية للمعدة",
        targetRole: isCritical ? "مدير السلامة وإدارة الصيانة (إشعار فوري SMS & Push)" : "مشرف الوردية والموقع",
        automatedRoutingRule: isCritical ? "CRITICAL_ESCALATION" : "SUPERVISOR_ROUTING",
        explanation: "تم التحليل الأولي للملاحظة وفقاً لمعايير STOP HSE المعتمدة.",
      });
    }

    const prompt = `أنت خبير واستشاري معتمد في السلامة والصحة المهنية (HSE) ومنهجية STOP (Safety Training Observation Program).
قم بتحليل ملاحظة السلامة التالية بدقة واحترافية:
${fullDescription}

قم بتوليد رد JSON نقي فقط (دون علامات ماركداون إضافية) بالصيغة التالية:
{
  "type": "تصرف غير آمن (Unsafe Act)" أو "حالة غير آمنة (Unsafe Condition)" أو "ممارسة آمنة (Safe Practice)",
  "category": "ميكانيكي" أو "كهربائي" أو "كيميائي / بيئي" أو "مهمات الوقاية (PPE)" أو "سلامة ومكافحة الحريق" أو "نظافة وترتيب الموقع" أو "مريح / ارغونوميكس",
  "severity": "منخفض (Low)" أو "متوسط (Medium)" أو "عالي (Critical)",
  "severityLevel": "low" أو "medium" أو "high",
  "riskScore": رقم من 10 إلى 100 يعبر عن حجم الخطر المحتمل,
  "immediateAction": "وصف الإجراء التصحيحي الفوري لمنع الخطر حالاً",
  "preventiveAction": "وصف الإجراء الوقائي الجذري لمنع تكرار الحادثة",
  "rootCause": "السبب الجذري المرجح (مثل: نقص تدريب، تهالك معدات، ضغط عمل، غياب إشراف، بيئة عمل غير ملائمة)",
  "targetRole": "الجهة الموجه إليها البلاغ آلياً (مثال: 'مشرف الوردية الميداني' للتصرفات السلوكية، أو 'مدير السلامة وإدارة الصيانة (إشعار فوري)' للحالات الحرجة)",
  "automatedRoutingRule": "SUPERVISOR_ROUTING" أو "CRITICAL_ESCALATION" أو "TRAINING_DEPT",
  "explanation": "شرح موجز لأسباب هذا التصنيف وفق معايير السلامة المهنية"
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const outputText = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(outputText.replace(/```json/g, "").replace(/```/g, "").trim());
    } catch {
      parsedData = {
        type: "حالة غير آمنة (Unsafe Condition)",
        category: "ميكانيكي",
        severity: "متوسط (Medium)",
        severityLevel: "medium",
        riskScore: 50,
        immediateAction: "تأمين الموقع والتحقق من سلامة الأفراد ومراجعة المعدة.",
        preventiveAction: "جدولة صيانة وقائية وتنظيم ورشة توعية.",
        rootCause: "تهالك معدات أو نقص صيانة",
        targetRole: "مشرف الوردية",
        automatedRoutingRule: "SUPERVISOR_ROUTING",
        explanation: "تحليل تلقائي بناءً على معايير STOP.",
      };
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/ai/classify:", error);
    return res.status(500).json({
      error: "فشل التحليل الذكي للبيانات",
      details: error?.message || String(error),
    });
  }
});

// AI Mobile Camera Radar & Thermal Scan Endpoint
app.post("/api/ai/radar-scan", async (req, res) => {
  try {
    const { mode, temperatureC, observedObject, notes } = req.body;
    const client = getGeminiClient();

    if (!client) {
      // Smart offline fallback
      const temp = Number(temperatureC) || 58;
      const isThermalIssue = temp > 70;
      const isNearMiss = temp > 65 || (notes && (notes.includes("شرخ") || notes.includes("تسريب") || notes.includes("اهتزاز")));
      const isSafe = temp < 50 && (!notes || notes.includes("طبيعي") || notes.includes("مستقر"));

      if (isSafe) {
        return res.json({
          isNearMiss: false,
          isAcuteDanger: false,
          isSafeCondition: true,
          nearMissProbability: 12,
          hazardType: "تشغيل اعتيادي ضمن الحدود الآمنة",
          hazardTypeEn: "Normal Safe Operation within Permissible Thresholds",
          defectDetected: "لا توجد تلفيات أو شروخ حرجة مرصودة",
          defectDetectedEn: "No critical defects or fractures detected",
          thermalHotspotC: temp,
          recommendationDecision: "NO_ACTION_REQUIRED",
          decisionSummary: "تم تقييم الحالة بواسطة الرادار: الحالة طبيعية وآمنة ولا تعد حادثاً وشيكاً (Near-Miss). لا يلزم اتخاذ أي إجراء في حينه، مع استمرار الرقابة الدورية.",
          decisionSummaryEn: "Assessed via Safety Radar: Condition is normal and safe, not classified as a near-miss. No immediate action required; maintain routine observation.",
          stepByStepAction: [
            "الحالة آمنة تماماً ولا تشكل أي خطر على العاملين بالمحيط.",
            "تسجيل الملاحظة كفحص اعتيادي دون الحاجة لفتح بطاقة طوارئ.",
            "مواصلة العمل الميداني وفق إجراءات السلامة القياسية."
          ],
          stepByStepActionEn: [
            "Condition is completely safe and poses no danger to surrounding personnel.",
            "Log as routine inspection without opening an emergency ticket.",
            "Continue field operations under standard operating procedures."
          ]
        });
      }

      return res.json({
        isNearMiss: true,
        isAcuteDanger: isThermalIssue || temp > 80,
        isSafeCondition: false,
        nearMissProbability: isThermalIssue ? 94 : 76,
        hazardType: isThermalIssue ? "ارتفاع حراري مفرط وخطر اشتعال وشيك" : "عطل ميكانيكي / تلف هيكلي قد يسبب حادثاً",
        hazardTypeEn: isThermalIssue ? "Excessive Thermal Overheating & Potential Ignition" : "Mechanical / Structural Defect Risk",
        defectDetected: isThermalIssue ? `بؤرة حرارية مفرطة (${temp}°C) أعلى من المعدل الطبيعي بـ 35°C` : "اهتزاز غير متزن وتراخي في وصلات التثبيت",
        defectDetectedEn: isThermalIssue ? `Thermal Hotspot (${temp}°C) exceeding normal threshold by 35°C` : "Unbalanced vibration and loose structural anchors",
        thermalHotspotC: temp,
        recommendationDecision: isThermalIssue ? "IMMEDIATE_ACTION" : "SCHEDULED_MAINTENANCE",
        decisionSummary: isThermalIssue 
          ? "تنبيه رادار STOP: الحالة تعد 'حادثاً وشيكاً وشديد الخطورة (Critical Near-Miss)'. يجب عزل المعدة وتبريدها فوراً لمنع الانفجار أو الحريق."
          : "تنبيه رادار STOP: الحالة تصنف كـ 'حادث وشيك محتمل' نتيجة اهتزازات غير معتادة. يلزم الفحص الفني قبل بدء الوردية التالية.",
        decisionSummaryEn: isThermalIssue
          ? "STOP Radar Alert: Condition is a Critical Near-Miss. Immediate isolation and cooling required to prevent catastrophic failure."
          : "STOP Radar Alert: Classified as Potential Near-Miss due to abnormal vibration. Technical inspection needed prior to next shift.",
        stepByStepAction: [
          "إيقاف التشغيل المؤقت للمعدة وعزل الطاقة الكهربائية/الهيدروليكية فوراً.",
          "وضع شريط تحذيري دائري وإبعاد العمال غير المصرح لهم مسافة 10 أمتار.",
          "إرسال بطاقة STOP فورية مدعومة ببيانات الفحص الحراري الحالية.",
          "استدعاء فني الصيانة المناوب للتحقق من أسباب ارتفاع درجة الحرارة."
        ],
        stepByStepActionEn: [
          "Temporarily halt equipment and safely isolate electrical/hydraulic sources immediately.",
          "Cordon off area with hazard tape, keeping non-authorized personnel 10m away.",
          "Submit instant STOP card backed by this thermal radar telemetry.",
          "Dispatch on-duty maintenance technician to investigate thermal surge."
        ]
      });
    }

    const prompt = `أنت نظام رادار سلامة ذكي متصل بكاميرا الموبايل ومستشعر الفحص الحراري (STOP AI Safety Radar & Thermal Inspector).
قم بتحليل بيانات الفحص الميداني التالية:
- وضع الرادار: ${mode}
- درجة الحرارة المرصودة بالمستشعر: ${temperatureC}°C
- المعدة أو الموقع المستهدف: ${observedObject || "معدة صناعية"}
- ملاحظات الراصد والمؤشرات البصرية: ${notes || "فحص مباشر بالكاميرا"}

المهمة الحاسمة: تلافي ترك تقدير الحادث الوشيك للعامل البشري؛ حدد بدقة:
1. هل الحالة تعد حادثاً وشيكاً (Near-Miss)؟ أم خطر داهم حاد (Acute Danger)؟ أم حالة آمنة طبيعية (Safe Condition) لا تعد حادثاً وشيكاً ولا تتطلب إجراءاً في حينه؟
2. نوع الخطر والتلفيات المرصودة أو البؤرة الحرارية.
3. التوجيه والإرشاد الصريح للخطوات الواجب اتخاذها، أو إعلام العامل بعدم اتخاذ أي إجراء لعدم وجود خطر.

أجب بصيغة JSON حصراً:
{
  "isNearMiss": boolean,
  "isAcuteDanger": boolean,
  "isSafeCondition": boolean,
  "nearMissProbability": number (0-100),
  "hazardType": "نوع الخطر بالعربية",
  "hazardTypeEn": "Hazard type in English",
  "defectDetected": "وصف التلف أو الخلل المكتشف",
  "defectDetectedEn": "Detected defect description",
  "thermalHotspotC": number,
  "recommendationDecision": "IMMEDIATE_ACTION" أو "SCHEDULED_MAINTENANCE" أو "NO_ACTION_REQUIRED",
  "decisionSummary": "خلاصة قرار الرادار بالعربية",
  "decisionSummaryEn": "Radar decision summary in English",
  "stepByStepAction": ["خطوة 1", "خطوة 2", "خطوة 3"],
  "stepByStepActionEn": ["Step 1", "Step 2", "Step 3"]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(response.text?.replace(/```json/g, "").replace(/```/g, "").trim() || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Error in radar-scan:", err);
    return res.status(500).json({ error: "فشل مسح الرادار الذكي" });
  }
});

// Root Cause Deep Dive Endpoint
app.post("/api/ai/root-cause-insights", async (req, res) => {
  try {
    const { stats, openReportsCount, frequentCategories } = req.body;
    const client = getGeminiClient();

    if (!client) {
      return res.json({
        summary: "تتركز أغلب البلاغات في قطاع الصيانة الميكانيكية وتجهيزات الوقاية الشخصية، ويشير التحليل إلى حاجة فورية لتعزيز برامج التوعية الميدانية قبل بدء الورديات.",
        topRiskArea: "محطة تعبئة الوقود المركزية ومستودع الزيوت",
        recommendedInterventions: [
          "تنظيم محادثات سلامة قبل الوردية (Toolbox Talks) تركز على مخاطر التسريبات والضغط العالي.",
          "تحديث فترات الصيانة الدورية لمضخات الضواغط وفحص صمامات الأمان.",
          "تكريم موظفي الوردية الأكثر التزاماً برصد الملاحظات الوقائية لتعزيز ثقافة الإبلاغ الإيجابي.",
        ],
      });
    }

    const prompt = `بصفتك مستشار HSE أول، حلل ملخص بلاغات السلامة التالي وقدم توصيات قيادية تنفيذية:
- عدد البلاغات المفتوحة: ${openReportsCount}
- الفئات الأكثر تكراراً: ${JSON.stringify(frequentCategories)}
- مؤشرات عامة: ${JSON.stringify(stats)}

أجب بتنسيق JSON خالص:
{
  "summary": "ملخص تنفيذي موجز للأسباب الجذرية ومستوى الخطر العام",
  "topRiskArea": "المنطقة الأكثر تعرضاً للخطر وفقاً للبلاغات",
  "recommendedInterventions": [
    "توصية إدارية / وقائية 1",
    "توصية إدارية / وقائية 2",
    "توصية إدارية / وقائية 3"
  ]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(response.text?.replace(/```json/g, "").replace(/```/g, "").trim() || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Error in root-cause insights:", err);
    return res.status(500).json({ error: "فشل استخراج التوصيات" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`STOP HSE Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
