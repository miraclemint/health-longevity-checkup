"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimation, PanInfo } from "framer-motion";
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
      nickname: "ผู้ฝึกวิถีสุขภาพ",
      color: "from-blue-400 to-cyan-500",
      bgSoft: "bg-blue-50",
      textColor: "text-blue-500",
      desc: "คุณดูแลสุขภาพได้ดีในหลายด้าน คุณให้ความสำคัญกับการมีชีวิตที่มีคุณภาพ หากรักษาวินัยอย่างต่อเนื่องก็จะก้าวสู่ระดับยอดเยี่ยมได้ ลองปิดจุดอ่อนบางด้านเพื่อสุขภาพที่สมบูรณ์ขึ้น",
    };
  } else if (score >= 50) {
    return {
      title: "ปานกลาง (At Risk)",
      nickname: "ผู้เริ่มต้นภารกิจสุขภาพ",
      color: "from-amber-400 to-orange-500",
      bgSoft: "bg-amber-50",
      textColor: "text-amber-500",
      desc: "คุณมีพฤติกรรมที่อาจส่งผลเสียสะสมในอนาคต เช่น ความเครียด การพักผ่อน หรือโภชนาการที่ไม่สมดุล ควรเริ่มปรับเปลี่ยนพฤติกรรมทีละน้อย เริ่มจากสิ่งที่ทำได้ง่ายที่สุดก่อน",
    };
  } else {
    return {
      title: "เสี่ยงสูง (Critical)",
      nickname: "ผู้ตื่นรู้สุขภาพ",
      color: "from-rose-400 to-red-500",
      bgSoft: "bg-rose-50",
      textColor: "text-rose-500",
      desc: "คะแนนของคุณอยู่ในระดับเฝ้าระวัง วิถีชีวิตปัจจุบันกำลังเร่งความเสื่อมของร่างกายและสะสมความเครียดสารพิษ ควรเริ่มดูแลตัวเองอย่างจริงจัง ทานอาหารที่มีประโยชน์ และพักผ่อนให้เพียงพอ",
    };
  }
}

// --- Main App Component ---

export default function LongevityGame() {
  const [gameState, setGameState] = useState<"intro" | "form" | "stageIntro" | "playing" | "calculating" | "result">("intro");
  const [currentStage, setCurrentStage] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

  const playSound = (type: "swipeLeft" | "swipeRight") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (type === "swipeRight") {
        // Happy "Ding"
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } else {
        // Dull "Thud"
        osc.type = "square";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnswer = (isYes: boolean) => {
    playSound(isYes ? "swipeRight" : "swipeLeft");

    if (isYes) {
      setSelections((prev) => {
        const current = prev[currentStage] || [];
        if (!current.includes(currentQuestionIndex)) {
          return { ...prev, [currentStage]: [...current, currentQuestionIndex] };
        }
        return prev;
      });
    } else {
      setSelections((prev) => {
        const current = prev[currentStage] || [];
        return { ...prev, [currentStage]: current.filter((i) => i !== currentQuestionIndex) };
      });
    }

    if (currentQuestionIndex < STAGES[currentStage].questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      if (currentStage < STAGES.length - 1) {
        setGameState("stageIntro");
        setCurrentStage((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        setGameState("calculating");
        setTimeout(() => setGameState("result"), 2500);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentStage > 0) {
      setCurrentStage((prev) => prev - 1);
      setCurrentQuestionIndex(STAGES[currentStage - 1].questions.length - 1);
      setGameState("stageIntro"); // go back to stage intro of previous stage
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
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: false
      });

      // Try using blob for better mobile support
      canvas.toBlob(async (blob) => {
        if (!blob) {
          // Fallback to dataURL
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = image;
          link.download = `longevity-score-${userInfo.name}-${totalScore}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
          return;
        }

        // Try Web Share API for mobile (share image directly)
        if (navigator.share && navigator.canShare) {
          const file = new File([blob], `longevity-score-${totalScore}.png`, { type: "image/png" });
          const shareData = { files: [file], title: "Longevity Score", text: `${userInfo.name} ได้คะแนนสุขภาพ ${totalScore}/100` };
          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            return;
          }
        }

        // Fallback: download as file
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `longevity-score-${userInfo.name}-${totalScore}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }, "image/png");
    } catch (err) {
      console.error("Failed to capture image", err);
      alert("เกิดข้อผิดพลาดในการบันทึกรูปภาพ กรุณาลองแคปหน้าจอแทน");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyInvite = () => {
    const inviteText = `🌟 ${userInfo.name} ได้คะแนนสุขภาพองค์รวม ${totalScore}/100 คะแนน!\n🏅 ฉายา: "${resultInfo.nickname}" (สุขภาพระดับ: ${resultInfo.title})\n\nลองมาเช็คสุขภาพและความยืนยาวของคุณได้ที่นี่เลย 👇\nhttps://health-longevity-checkup.vercel.app`;
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
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg border border-slate-100">
              <HeartPulse className="w-12 h-12 text-emerald-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              BEYONDE HEALTH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                LONGEVITY CHECKUP
              </span>
            </h1>
            <p className="text-slate-700 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-normal">
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
            <div className="mt-14 text-xs text-slate-500 max-w-lg">
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
              <div className="mb-8 border-b border-slate-200 pb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">ข้อมูลเบื้องต้นของคุณ</h2>
                <p className="text-slate-600">เพื่อการวิเคราะห์เชิงลึกและปรับแต่ง Health Age</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-slate-700 mb-2 font-medium">ชื่อ - นามสกุล หรือ ชื่อเล่น</label>
                  <p className="text-sm text-slate-500 mb-2">ข้อมูลนี้จะถูกแสดงบนผลลัพธ์เพื่อใช้แชร์ให้เพื่อนๆ</p>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
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
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
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
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2 font-medium">คุณคิดว่าตัวเองมีอายุเท่าใด? (ไม่ใช่อายุจริง)</label>
                  <p className="text-sm text-slate-500 mb-2">ประเมินจากความรู้สึกของคุณเอง เช่น รู้สึกว่าอายุสุขภาพของคุณอยู่ที่ประมาณกี่ปี</p>
                  <input
                    type="number"
                    value={userInfo.estimatedAge}
                    onChange={(e) => setUserInfo({ ...userInfo, estimatedAge: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                    placeholder="เช่น 30, 45, 55"
                    min="1"
                    max="120"
                  />
                </div>

                <button
                  onClick={() => setGameState("stageIntro")}
                  disabled={!userInfo.gender || !userInfo.age || !userInfo.name}
                  className="w-full mt-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-600 transition-all flex justify-center items-center gap-2 shadow-sm"
                >
                  เริ่มทำภารกิจ <Play className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage Intro Screen */}
        {gameState === "stageIntro" && (
          <motion.div
            key={`stageIntro-${currentStage}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 max-w-lg mx-auto"
          >
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-slate-50 relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-20 animate-ping"></div>
              <div className="[&>svg]:w-14 [&>svg]:h-14">
                {STAGES[currentStage].icon}
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 font-bold rounded-full text-sm mb-4">
              <Zap className="w-4 h-4" /> หมวดที่ {currentStage + 1} จาก {STAGES.length}
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              {STAGES[currentStage].title}
            </h2>

            <p className="text-slate-600 text-xl font-medium mb-10 leading-relaxed max-w-md">
              {STAGES[currentStage].desc}
            </p>

            <button
              onClick={() => setGameState("playing")}
              className="group relative px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xl overflow-hidden shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 w-full"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                เริ่มตอบคำถาม <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        )}

        {/* Playing Screen */}
        {gameState === "playing" && (() => {
          const currentQuestionData = STAGES[currentStage].questions[currentQuestionIndex];
          const isSelected = selections[currentStage]?.includes(currentQuestionIndex);

          let passed = 0;
          for (let i = 0; i < currentStage; i++) {
            passed += STAGES[i].questions.length;
          }
          passed += currentQuestionIndex;
          const total = STAGES.reduce((acc, s) => acc + s.questions.length, 0);
          const overallProgress = (passed / total) * 100;

          return (
            <motion.div
              key={`playing-${currentStage}-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-md mx-auto w-full px-4 pt-6 pb-24 flex flex-col min-h-[100dvh] justify-between relative"
            >
              {/* Modern Top Header & Progress */}
              <div className="w-full mb-4 shrink-0 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5">
                      {STAGES[currentStage].icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800 leading-none mb-1">
                        {STAGES[currentStage].title}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        ข้อ {currentQuestionIndex + 1} จาก {STAGES[currentStage].questions.length}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      ภาพรวม
                    </p>
                    <p className="text-base font-black text-emerald-500 leading-none">
                      {Math.round(overallProgress)}%
                    </p>
                  </div>
                </div>

                {/* Sleek Progress Bar */}
                <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700 ease-out relative"
                    style={{ width: `${overallProgress}%` }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]" />
                  </div>
                </div>
              </div>

              {/* Centered Draggable Card Area */}
              <div className="flex-1 w-full relative flex items-center justify-center my-4 min-h-[380px]">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`card-${currentStage}-${currentQuestionIndex}`}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.x > 100) {
                        handleAnswer(true);
                      } else if (info.offset.x < -100) {
                        handleAnswer(false);
                      }
                    }}
                    initial={{ scale: 0.9, opacity: 0, y: 30, rotateX: -10 }}
                    animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -20, rotateZ: 5 }}
                    transition={{ type: "spring", stiffness: 250, damping: 25 }}
                    className={`absolute inset-0 bg-gradient-to-br from-white to-slate-50 border-4 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] cursor-grab active:cursor-grabbing transition-colors ${isSelected ? 'border-emerald-300 shadow-emerald-500/10' : 'border-slate-100'}`}
                    style={{ transformPerspective: 1000 }}
                    whileDrag={{ scale: 1.05, border: "4px solid #34d399", rotateZ: (Math.random() - 0.5) * 6, boxShadow: "0 30px 60px -15px rgba(16, 185, 129, 0.2)" }}
                  >
                    <div className="absolute top-4 right-4 h-3 flex gap-1">
                      {STAGES[currentStage].questions.map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${i === currentQuestionIndex ? "bg-emerald-500" : "bg-slate-200"}`} />
                      ))}
                    </div>
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      {STAGES[currentStage].icon}
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 leading-snug mb-6 tracking-tight">
                      {currentQuestionData.text}
                    </h3>
                    <div className="mt-4 text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-4 bg-slate-100/80 px-5 py-2.5 rounded-full border border-slate-200">
                      <div className="flex items-center gap-1.5 text-rose-500">
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" /> เลื่อนซ้าย: ไม่
                      </div>
                      <span className="text-slate-300">|</span>
                      <div className="flex items-center gap-1.5 text-emerald-500">
                        เลื่อนขวา: ใช่ <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Buttons (Fixed or Bottom) */}
              <div className="w-full shrink-0 mt-4 space-y-4">
                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => handleAnswer(false)}
                    className="flex-1 py-4 bg-white border-b-4 border-2 border-slate-200 border-b-rose-200 hover:border-rose-400 focus:border-rose-400 text-rose-500 hover:bg-rose-50 rounded-2xl font-black text-lg transition-all active:border-b-0 active:translate-y-1 flex justify-center items-center shadow-sm"
                  >
                    ✕ ไม่
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 py-4 bg-white border-b-4 border-2 border-slate-200 border-b-emerald-200 hover:border-emerald-400 focus:border-emerald-400 text-emerald-500 hover:bg-emerald-50 rounded-2xl font-black text-lg transition-all active:border-b-0 active:translate-y-1 flex justify-center items-center shadow-sm"
                  >
                    ✓ ใช่
                  </button>
                </div>

                <div className="text-center">
                  {(currentStage > 0 || currentQuestionIndex > 0) ? (
                    <button
                      onClick={handlePrevQuestion}
                      className="text-sm text-slate-400 hover:text-slate-600 font-bold transition-colors py-2"
                    >
                      ย้อนกลับแก้ไขข้อก่อนหน้า
                    </button>
                  ) : (
                    <div className="h-9"></div> {/* Placeholder to keep height consistent */}
                  )}
                </div>
              </div>
            </motion.div>
          );
        })()}

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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">กำลังประมวลผลสุขภาพองค์รวม...</h2>
            <p className="text-slate-600 max-w-md animate-pulse">
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
                  <div className="text-center mb-10 pb-6 border-b border-slate-200">
                    <span className="text-slate-600 text-sm font-medium uppercase tracking-widest block mb-1">ผลการประเมินของ</span>
                    <h3 className="text-2xl font-bold text-slate-900">{userInfo.name}</h3>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
                  <div className="text-center md:text-left">
                    <p className="text-slate-600 font-bold tracking-widest uppercase mb-2">Longevity Score</p>
                    <div className={`text-7xl font-black mb-4 ${resultInfo.textColor}`}>
                      {totalScore}<span className="text-3xl text-slate-500">/100</span>
                    </div>

                    <div className={`p-6 ${resultInfo.bgSoft} rounded-2xl border border-slate-100`}>
                      <p className="text-sm text-slate-700 mb-2 font-bold tracking-wide">HEALTH AGE (อายุสุขภาพ)</p>
                      <div className="text-3xl font-bold text-slate-800 flex items-center md:justify-start justify-center gap-3">
                        {healthAge} <span className="text-lg font-semibold text-slate-700">ปี</span>
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
                      <RadarChart cx="50%" cy="50%" outerRadius="55%" data={calculateRadarData()}>
                        <PolarGrid stroke="#cbd5e1" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fill: '#1e293b', fontSize: 11, fontWeight: 700 }}
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

                <div className="p-6 md:p-8 bg-slate-50 rounded-3xl border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" /> สรุปผลลัพธ์สุขภาพ
                  </h3>
                  <p className="text-slate-800 leading-relaxed text-lg font-normal">
                    {resultInfo.desc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-full mb-3 text-emerald-600">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div className="text-slate-800 font-bold tracking-widest text-sm mb-1">BEYONDE HEALTH</div>
                  <div className="text-slate-500 text-xs tracking-wider uppercase">Longevity Checkup</div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center max-w-lg mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">ท้าเพื่อนเช็คสุขภาพ!</h3>
              <p className="text-slate-600 mb-6 text-sm">
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
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg transition-all shadow-sm"
              >
                เริ่มประเมินใหม่
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}
