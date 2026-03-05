"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Play, ArrowRight, Send, CheckCircle2, Shield, HeartPulse, Brain, Zap, Moon, Flame, Trophy, Activity, Camera, Copy, Check, Users } from "lucide-react";
import html2canvas from "html2canvas";

// --- Game Data ---

const STAGES = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "พลังร่างกาย",
    desc: "Physical Vitality - ในช่วง 7 วันที่ผ่านมา",
    maxScore: 15,
    questions: [
      { text: "ออกกำลังกายระดับปานกลางถึงหนักอย่างน้อย 3 วันต่อสัปดาห์", point: 4 },
      { text: "เดินหรือเคลื่อนไหวร่างกายมากกว่า 30 นาทีในแต่ละวัน", point: 4 },
      { text: "ไม่รู้สึกเหนื่อยง่ายระหว่างทำกิจกรรมในชีวิตประจำวัน", point: 3 },
      { text: "มีกิจกรรมเสริมกล้ามเนื้อ เช่น เวทเทรนนิ่ง โยคะ อย่างน้อย 2 ครั้ง/สัปดาห์", point: 4 },
    ],
  },
  {
    icon: <Flame className="w-6 h-6 text-orange-500" />,
    title: "โภชนาการ",
    desc: "Metabolic & Nutritional Health",
    maxScore: 20,
    questions: [
      { text: "ทานผักและผลไม้รวมกันมากกว่า 5 ส่วนต่อวัน (ประมาณ 400 กรัม)", point: 4 },
      { text: "หลีกเลี่ยงอาหารแปรรูป น้ำอัดลม ขนมหวาน และของทอด", point: 4 },
      { text: "ดื่มน้ำสะอาดอย่างน้อย 1.5 ลิตรต่อวัน", point: 4 },
      { text: "ควบคุมน้ำหนักให้อยู่ในเกณฑ์ปกติตามดัชนีมวลกาย (BMI)", point: 4 },
      { text: "พยายามลดการบริโภคแป้งขัดสี น้ำตาล และไขมันอิ่มตัว", point: 4 },
    ],
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-500" />,
    title: "นิสัยสุขภาพ",
    desc: "Proactive Longevity",
    maxScore: 15,
    questions: [
      { text: "ทานอาหารเสริม เช่น วิตามิน C, E หรือสารต้านอนุมูลอิสระจากธรรมชาติเป็นประจำ", point: 3 },
      { text: "เคยมีพฤติกรรมดูแลสุขภาพเชิงรุก เช่น Intermittent Fasting หรือควบคุมมื้ออาหาร", point: 3 },
      { text: "ตรวจสุขภาพประจำปี หรือพบแพทย์เพื่อติดตามสุขภาพเชิงป้องกัน", point: 3 },
      { text: "ไม่สูบบุหรี่ ไม่ดื่มแอลกอฮอล์ หรือ ดื่มไม่เกิน 1–2 ดื่ม/สัปดาห์", point: 3 },
      { text: "ดูแลสุขภาพช่องปาก เช่น ขูดหินปูน ใช้ไหมขัดฟัน และตรวจสุขภาพฟันเป็นประจำ", point: 3 },
    ],
  },
  {
    icon: <Moon className="w-6 h-6 text-indigo-500" />,
    title: "การนอน",
    desc: "Sleep & Recovery",
    maxScore: 15,
    questions: [
      { text: "นอนหลับสนิท 6–8 ชั่วโมงต่อคืนอย่างสม่ำเสมอ", point: 3 },
      { text: "ตื่นมารู้สึกสดชื่น ไม่เพลีย", point: 3 },
      { text: "ไม่มีปัญหานอนสะดุ้ง ตื่นกลางดึก หรือฝันร้าย", point: 3 },
      { text: "ในแต่ละวัน รู้สึกเครียดน้อยกว่ารู้สึกสงบ", point: 3 },
      { text: "มีวิธีจัดการความเครียด เช่น สมาธิ หายใจลึก เดิน หรือเขียนสมุดบันทึกขอบคุณ", point: 3 },
    ],
  },
  {
    icon: <Activity className="w-6 h-6 text-emerald-500" />,
    title: "สุขภาพลำไส้",
    desc: "Gut & Digestive Wellness",
    maxScore: 8,
    questions: [
      { text: "รับประทานอาหารที่มีไฟเบอร์สูง เช่น ผัก ผลไม้ ธัญพืชไม่ขัดสี อย่างน้อยวันละ 5 ส่วน", point: 2 },
      { text: "บริโภคอาหารหมักดองที่มีจุลินทรีย์ที่มีประโยชน์ อย่างน้อยสัปดาห์ละ 3 ครั้ง", point: 2 },
      { text: "ไม่ค่อยมีอาการท้องผูกหรือท้องเสียบ่อย", point: 1 },
      { text: "ไม่ได้กินยาปฏิชีวนะ (ยาฆ่าเชื้อ) ในช่วง 6 เดือนที่ผ่านมา", point: 1 },
      { text: "รู้สึกว่าระบบย่อยอาหารทำงานได้ดี ไม่มีอาการแน่นท้องหรือกรดไหลย้อน", point: 2 },
    ],
  },
  {
    icon: <Brain className="w-6 h-6 text-pink-500" />,
    title: "สมองและอารมณ์",
    desc: "Brain & Emotional Wellness",
    maxScore: 10,
    questions: [
      { text: "ฝึกสมองหรือเรียนรู้สิ่งใหม่ ๆ อย่างน้อยสัปดาห์ละ 2 ครั้ง", point: 3 },
      { text: "รู้สึกว่าชีวิตมีเป้าหมายและคุณค่า", point: 3 },
      { text: "มีคนที่สามารถพูดคุยหรือระบายเมื่อรู้สึกไม่สบายใจ", point: 2 },
      { text: "มีกิจกรรมทางสังคมหรือพบปะผู้อื่นอย่างน้อย 1 ครั้ง/สัปดาห์", point: 2 },
    ],
  },
  {
    icon: <HeartPulse className="w-6 h-6 text-rose-500" />,
    title: "ความเสี่ยงสุขภาพ",
    desc: "Lifestyle Risk & Genetics",
    maxScore: 10,
    questions: [
      { text: "ไม่มีโรคเรื้อรัง เช่น เบาหวาน ความดัน หัวใจ", point: 2 },
      { text: "ไม่เจ็บป่วย หรือไม่เข้าโรงพยาบาลในช่วง 6 เดือนที่ผ่านมา", point: 2 },
      { text: "มีญาติสายตรง ที่มีอายุเกิน 90 ปี", point: 2 },
      { text: "รู้สึกว่าร่างกาย “อ่อนเยาว์กว่า” กว่าอายุจริง", point: 2 },
      { text: "ไม่ทำงาน หรืออาศัยในสิ่งแวดล้อมที่เสี่ยง สารเคมี ฝุ่นควัน มลภาวะ", point: 2 },
    ],
  },
  {
    icon: <Trophy className="w-6 h-6 text-amber-500" />,
    title: "ความสัมพันธ์",
    desc: "Relationship & Social Wellness",
    maxScore: 7,
    questions: [
      { text: "มีเพื่อนสนิทหรือคนใกล้ชิดที่ขอคำปรึกษา ความช่วยเหลือได้อย่างน้อย 1 คน", point: 3 },
      { text: "พบปะหรือพูดคุยกับเพื่อนหรือครอบครัวอย่างน้อยสัปดาห์ละ 1 ครั้ง", point: 1 },
      { text: "มีส่วนร่วมในกิจกรรมชุมชน อาสาสมัคร หรือกลุ่มงานอดิเรกอย่างน้อยเดือนละครั้ง", point: 1 },
      { text: "พึงพอใจในความสัมพันธ์กับคู่ครองหรือครอบครัวของคุณ", point: 1 },
      { text: "รู้สึกว่าความสัมพันธ์ในชีวิตช่วยเติมเต็มจิตใจและทำให้รู้สึกมีคุณค่า", point: 1 },
    ],
  }
];

// --- Helpers ---

function calculateHealthAge(actualAgeCategory: string, score: number) {
  let baseAge = 35;
  if (actualAgeCategory === "น้อยกว่า 25 ปี") baseAge = 22;
  else if (actualAgeCategory === "25 - 35 ปี") baseAge = 30;
  else if (actualAgeCategory === "36 - 45 ปี") baseAge = 40;
  else if (actualAgeCategory === "46 - 55 ปี") baseAge = 50;
  else if (actualAgeCategory === "56 ปี ขึ้นไป") baseAge = 60;

  let modifier = 0;
  if (score >= 90) modifier = -8;
  else if (score >= 80) modifier = -4;
  else if (score >= 70) modifier = -1;
  else if (score >= 60) modifier = +2;
  else if (score >= 50) modifier = +5;
  else modifier = +10;

  return Math.max(18, baseAge + modifier);
}

function getResultData(score: number) {
  if (score >= 90) {
    return {
      title: "ยอดเยี่ยม (Thriving)",
      nickname: "ผู้พิชิตอายุยืน",
      color: "from-emerald-400 to-teal-500",
      bgSoft: "bg-emerald-50",
      textColor: "text-emerald-500",
      desc: "คุณมีสุขภาพโดยรวมดีเยี่ยม บ่งบอกถึงโอกาสในการมีอายุยืนยาวและมีสุขภาพที่ดี การดูแลตนเองรอบด้านส่งผลให้คุณมีเซลล์ดีเยี่ยม ไม่มีภาวะอักเสบเรื้อรัง รักษามาตรฐานนี้ต่อไป!",
    };
  } else if (score >= 70) {
    return {
      title: "ดีมาก (Balanced)",
      nickname: "สายสมดุล",
      color: "from-blue-400 to-cyan-500",
      bgSoft: "bg-blue-50",
      textColor: "text-blue-500",
      desc: "คุณดูแลสุขภาพได้ดีในหลายด้าน คุณให้ความสำคัญกับการมีชีวิตที่มีคุณภาพ หากรักษาวินัยอย่างต่อเนื่องก็จะก้าวสู่ระดับยอดเยี่ยมได้ ลองปิดจุดอ่อนบางด้านเพื่อสุขภาพที่สมบูรณ์ขึ้น",
    };
  } else if (score >= 50) {
    return {
      title: "ปานกลาง (At Risk)",
      nickname: "นักสู้สุขภาพ",
      color: "from-amber-400 to-orange-500",
      bgSoft: "bg-amber-50",
      textColor: "text-amber-500",
      desc: "คุณมีพฤติกรรมที่อาจส่งผลเสียสะสมในอนาคต เช่น ความเครียด การพักผ่อน หรือโภชนาการที่ไม่สมดุล ควรเริ่มปรับเปลี่ยนพฤติกรรมทีละน้อย เริ่มจากสิ่งที่ทำได้ง่ายที่สุดก่อน",
    };
  } else {
    return {
      title: "เสี่ยงสูง (Critical)",
      nickname: "นักฟื้นฟู",
      color: "from-rose-400 to-red-500",
      bgSoft: "bg-rose-50",
      textColor: "text-rose-500",
      desc: "คะแนนของคุณอยู่ในระดับเฝ้าระวัง วิถีชีวิตปัจจุบันกำลังเร่งความเสื่อมของร่างกายและสะสมความเครียดสารพิษ ควรเริ่มดูแลตัวเองอย่างจริงจัง ทานอาหารที่มีประโยชน์ และพักผ่อนให้เพียงพอ",
    };
  }
}

// --- Main App Component ---

export default function LongevityGame() {
  const [gameState, setGameState] = useState<"intro" | "form" | "playing" | "calculating" | "result">("intro");
  const [currentStage, setCurrentStage] = useState(0);

  // Forms
  const [userInfo, setUserInfo] = useState({
    name: "",
    gender: "",
    age: "",
    weight: "",
    height: "",
    estimatedAge: "",
    phone: "",
    line: "",
    email: ""
  });

  // Score tracking: stageIndex -> array of selected question indices
  const [selections, setSelections] = useState<Record<number, number[]>>({});

  // Refs and Export States
  const shareRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleSelection = (stageIndex: number, questionIndex: number) => {
    setSelections((prev) => {
      const current = prev[stageIndex] || [];
      if (current.includes(questionIndex)) {
        return { ...prev, [stageIndex]: current.filter((i) => i !== questionIndex) };
      } else {
        return { ...prev, [stageIndex]: [...current, questionIndex] };
      }
    });
  };

  const handleNextStage = () => {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(currentStage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setGameState("calculating");
      setTimeout(() => setGameState("result"), 2500);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStage = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const calculateTotalScore = () => {
    let total = 0;
    Object.keys(selections).forEach((stageIdxStr) => {
      const stageIdx = parseInt(stageIdxStr);
      const stageOptions = STAGES[stageIdx].questions;
      selections[stageIdx].forEach((qIdx) => {
        total += stageOptions[qIdx].point;
      });
    });
    return Math.min(100, total); // cap at 100 just in case
  };

  const calculateRadarData = () => {
    return STAGES.map((stage, idx) => {
      let score = 0;
      if (selections[idx]) {
        selections[idx].forEach((qIdx) => {
          score += stage.questions[qIdx].point;
        });
      }
      // scale to 0-100 for graph display
      const percent = Math.round((score / stage.maxScore) * 100);
      return {
        subject: stage.title,
        A: percent,
        fullMark: 100,
      };
    });
  };

  const totalScore = calculateTotalScore();
  const healthAge = calculateHealthAge(userInfo.age || "36 - 45 ปี", totalScore);
  const resultInfo = getResultData(totalScore);

  const handleShare = async () => {
    if (!shareRef.current || isSaving) return;
    setIsSaving(true);

    try {
      // Wait a bit to ensure fonts and charts are fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `longevity-score-${totalScore}.png`;
      link.click();

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to capture image", err);
      alert("เกิดข้อผิดพลาดในการบันทึกรูปภาพ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyInvite = () => {
    const inviteText = `ฉันได้คะแนนสุขภาพองค์รวม ${totalScore}/100 คะแนน! (สุขภาพระดับ: ${resultInfo.title})\nลองมาเช็คสุขภาพและความยืนยาวของคุณได้ที่นี่เลย 👇\n[ใส่ลิงก์เว็บไซต์ของคุณที่นี่]`;
    navigator.clipboard.writeText(inviteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">

        {/* Intro Screen */}
        {gameState === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4"
          >
            <div className="w-24 h-24 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center mb-8 shadow-sm border border-slate-100">
              <HeartPulse className="w-12 h-12 text-emerald-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 leading-tight tracking-tight">
              BEYONDE HEALTH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                LONGEVITY CHECKUP
              </span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-light">
              สำรวจศักยภาพสุขภาพและความยืนยาวของคุณ ด้วยแนวทางแบบองค์รวม (Holistic Health)
              เพื่อวางแผนชะลอวัยอย่างยั่งยืน
            </p>
            <button
              onClick={() => setGameState("form")}
              className="group relative px-10 py-4 bg-slate-900 text-white rounded-full font-semibold text-lg overflow-hidden shadow-md hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                เริ่มต้นประเมินสุขภาพ <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <div className="mt-14 text-xs text-slate-400 max-w-lg font-light">
              อ้างอิงจากศาสตร์ชะลอวัยแบบองค์รวม (Holistic Health Longevity Science) <br />
              จากมหาลัยชั้นนำระดับโลก
            </div>
          </motion.div>
        )}

        {/* Form Screen */}
        {gameState === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto w-full px-4 py-12"
          >
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm">
              <div className="mb-8 border-b border-slate-100 pb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">ข้อมูลเบื้องต้นของคุณ</h2>
                <p className="text-slate-500 font-light">เพื่อการวิเคราะห์เชิงลึกและปรับแต่ง Health Age</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-slate-700 mb-2 font-medium">ชื่อ - นามสกุล หรือ ชื่อเล่น</label>
                  <p className="text-sm text-slate-400 mb-2 font-light">ข้อมูลนี้จะถูกแสดงบนผลลัพธ์เพื่อใช้แชร์ให้เพื่อนๆ</p>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                    placeholder="กรอกชื่อของคุณ"
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-slate-700 mb-3 font-medium">เพศ</label>
                  <div className="flex gap-3">
                    {["ชาย", "หญิง", "ไม่ระบุ"].map((g) => (
                      <button
                        key={g}
                        onClick={() => setUserInfo({ ...userInfo, gender: g })}
                        className={`flex-1 py-3 rounded-xl border transition-all ${userInfo.gender === g
                            ? "bg-emerald-50 border-emerald-500 text-emerald-600 font-semibold"
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-3 font-medium">อายุของคุณ</label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {["น้อยกว่า 25 ปี", "25 - 35 ปี", "36 - 45 ปี", "46 - 55 ปี", "56 ปี ขึ้นไป"].map((a) => (
                      <button
                        key={a}
                        onClick={() => setUserInfo({ ...userInfo, age: a })}
                        className={`py-3 rounded-xl border transition-all ${userInfo.age === a
                            ? "bg-emerald-50 border-emerald-500 text-emerald-600 font-semibold"
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setGameState("playing")}
                  disabled={!userInfo.gender || !userInfo.age || !userInfo.name}
                  className="w-full mt-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-600 transition-all flex justify-center items-center gap-2 shadow-sm"
                >
                  เริ่มทำภารกิจ <Play className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Playing Screen */}
        {gameState === "playing" && (
          <motion.div
            key={`playing-${currentStage}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-3xl mx-auto w-full px-4 py-8 md:py-12"
          >
            <div className="mb-10">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-3 tracking-wider uppercase">
                <span>ภารกิจที่ {currentStage + 1} / {STAGES.length}</span>
                <span className="text-emerald-500">{Math.round(((currentStage + 1) / STAGES.length) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                {STAGES.map((_, i) => (
                  <div
                    key={i}
                    className={`h-full flex-1 border-r border-white last:border-0 transition-colors duration-500 ${i < currentStage ? "bg-emerald-500" : i === currentStage ? "bg-emerald-300" : "bg-transparent"
                      }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                {STAGES[currentStage].icon}
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{STAGES[currentStage].title}</h2>
                <p className="text-slate-500 mt-1 font-light">{STAGES[currentStage].desc}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl mb-8 border border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                <strong className="text-emerald-600 font-semibold">คำชี้แจง:</strong> โปรดเลือกข้อที่ตรงกับพฤติกรรมที่ผ่านมาของท่าน <br className="hidden md:block" />
                (เลือกได้มากกว่า 1 ข้อ หากไม่มีข้อใดตรง สามารถกดข้ามได้เลย)
              </p>
            </div>

            <div className="space-y-4">
              {STAGES[currentStage].questions.map((q, idx) => {
                const isSelected = selections[currentStage]?.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleSelection(currentStage, idx)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-start gap-4 group ${isSelected
                        ? "bg-emerald-50 border-emerald-500"
                        : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                  >
                    <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-emerald-500 border-emerald-500" : "border-slate-300 group-hover:border-slate-400 bg-white"
                      }`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`text-lg leading-relaxed ${isSelected ? "text-slate-800 font-medium" : "text-slate-600 font-light"}`}>
                      {q.text}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 mt-12">
              {currentStage > 0 && (
                <button
                  onClick={handlePrevStage}
                  className="px-6 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-medium transition-colors hidden md:block"
                >
                  ย้อนกลับ
                </button>
              )}
              <button
                onClick={handleNextStage}
                className="flex-1 py-4 bg-slate-900 text-white hover:bg-emerald-600 rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2 shadow-sm"
              >
                {currentStage === STAGES.length - 1 ? (
                  <>ดูผลการประเมิน <Send className="w-5 h-5" /></>
                ) : (
                  <>หน้าถัดไป <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Calculating Screen */}
        {gameState === "calculating" && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4"
          >
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin border-opacity-70"></div>
              <div className="absolute inset-2 rounded-full border-r-2 border-teal-400 animate-spin border-opacity-70" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-10 h-10 text-emerald-500 animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">กำลังประมวลผลสุขภาพองค์รวม...</h2>
            <p className="text-slate-500 max-w-md animate-pulse font-light">
              ระบบกำลังคำนวณ Longevity Score และจัดทำแผนการประเมินสุขภาพของคุณในทั้ง 8 มิติ
            </p>
          </motion.div>
        )}

        {/* Result Screen */}
        {gameState === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12"
          >
            <div
              ref={shareRef}
              id="share-card"
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 relative"
            >
              <div className={`pt-12 pb-8 px-8 text-center bg-gradient-to-br ${resultInfo.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold text-sm tracking-wider mb-6 border border-white/30">
                    ฉายาสุขภาพ
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-sm">
                    {resultInfo.nickname}
                  </h2>
                  <div className="text-white/90 font-medium text-lg tracking-wide uppercase">
                    {resultInfo.title}
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12">
                {userInfo.name && (
                  <div className="text-center mb-10 pb-6 border-b border-slate-100">
                    <span className="text-slate-400 text-sm font-light uppercase tracking-widest block mb-1">ผลการประเมินของ</span>
                    <h3 className="text-2xl font-bold text-slate-800">{userInfo.name}</h3>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
                  <div className="text-center md:text-left">
                    <p className="text-slate-400 font-medium tracking-widest uppercase mb-2">Longevity Score</p>
                    <div className={`text-7xl font-black mb-4 ${resultInfo.textColor}`}>
                      {totalScore}<span className="text-3xl text-slate-300">/100</span>
                    </div>

                    <div className={`p-6 ${resultInfo.bgSoft} rounded-2xl border border-white`}>
                      <p className="text-sm text-slate-500 mb-2 font-medium tracking-wide">HEALTH AGE (อายุสุขภาพ)</p>
                      <div className="text-3xl font-bold text-slate-800 flex items-center md:justify-start justify-center gap-3">
                        {healthAge} <span className="text-lg font-normal text-slate-500">ปี</span>
                        {parseInt(userInfo.age) < healthAge ? (
                          <span className="text-sm bg-white text-rose-500 border border-rose-100 px-3 py-1 rounded-full shadow-sm">+ แก่กว่าวัย</span>
                        ) : (
                          <span className="text-sm bg-white text-emerald-500 border border-emerald-100 px-3 py-1 rounded-full shadow-sm">- อ่อนเยาว์</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="h-64 md:h-80 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={calculateRadarData()}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                          name="Score"
                          dataKey="A"
                          stroke="#10b981"
                          strokeWidth={3}
                          fill="#34d399"
                          fillOpacity={0.4}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-6 md:p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" /> สรุปผลลัพธ์สุขภาพ
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg font-light">
                    {resultInfo.desc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full mb-3 text-emerald-600">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div className="text-slate-800 font-bold tracking-widest text-sm mb-1">BEYONDE HEALTH</div>
                  <div className="text-slate-400 text-xs tracking-wider uppercase">Longevity Checkup</div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center max-w-lg mx-auto bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">ท้าเพื่อนเช็คสุขภาพ!</h3>
              <p className="text-slate-500 font-light mb-6 text-sm">
                ชวนเพื่อนๆ หรือคนที่คุณรักมาประเมินสุขภาพ เพื่อวางแผนชีวิตที่ยืนยาวไปด้วยกัน
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleCopyInvite}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 hover:border-blue-500 hover:text-blue-600 text-slate-700 rounded-xl font-semibold transition-all"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  {copied ? "คัดลอกข้อความท้าสำเร็จ!" : "คัดลอกข้อความชวนเพื่อน"}
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
              <button
                onClick={handleShare}
                disabled={isSaving}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg transition-all shadow-md hover:shadow-emerald-500/20 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : saved ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
                {isSaving ? "กำลังบันทึก..." : saved ? "บันทึกสำเร็จ!" : "บันทึกผลลัพธ์เป็นรูปภาพ"}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg transition-all shadow-sm"
              >
                เริ่มประเมินใหม่
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
