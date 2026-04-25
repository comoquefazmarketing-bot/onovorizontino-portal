'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGREFC.png';

// --- TIPAGEM ---
type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string; };
type Lineup = Record<string, Player | null>;
type Step = 'arena' | 'summary';

// --- JOGADORES (39) ---
const PLAYERS: Player[] = [
    { id:1, name:'César Augusto', short:'CÉSAR', num:31, pos:'GOL', foto:BASE+'CESAR-AUGUSTO.jpg.webp' },
    { id:2, name:'Jordi', short:'JORDI', num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp' },
    { id:3, name:'João Scapin', short:'SCAPIN', num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp' },
    { id:4, name:'Lucas Ribeiro', short:'LUCAS', num:1, pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp' },
    { id:5, name:'Lora', short:'LORA', num:2, pos:'LAT', foto:BASE+'LORA.jpg.webp' },
    { id:6, name:'Castrillón', short:'CASTRILLÓN', num:6, pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp' },
    { id:7, name:'Arthur Barbosa', short:'A. BARBOSA', num:22, pos:'LAT', foto:BASE+'ARTHUR-BARBOSA.jpg.webp' },
    { id:8, name:'Sander', short:'SANDER', num:33, pos:'LAT', foto:BASE+'SANDER.jpg.webp' },
    { id:9, name:'Maykon Jesus', short:'MAYKON', num:27, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp' },
    { id:10, name:'Dantas', short:'DANTAS', num:3, pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp' },
    { id:11, name:'Eduardo Brock', short:'E. BROCK', num:5, pos:'ZAG', foto:BASE+'EDUARDO-BROCK.jpg.webp' },
    { id:12, name:'Patrick', short:'PATRICK', num:4, pos:'ZAG', foto:BASE+'PATRICK.jpg.webp' },
    { id:13, name:'Gabriel Bahia', short:'G. BAHIA', num:14, pos:'ZAG', foto:BASE+'GABRIEL-BAHIA.jpg.webp' },
    { id:14, name:'Carlinhos', short:'CARLINHOS', num:25, pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp' },
    { id:15, name:'Alemão', short:'ALEMÃO', num:28, pos:'ZAG', foto:BASE+'ALEMAO.jpg.webp' },
    { id:16, name:'Renato Palm', short:'R. PALM', num:24, pos:'ZAG', foto:BASE+'RENATO-PALM.jpg.webp' },
    { id:17, name:'Alvariño', short:'ALVARIÑO', num:35, pos:'ZAG', foto:BASE+'IVAN-ALVARINO.jpg.webp' },
    { id:18, name:'Bruno Santana', short:'B. SANTANA', num:33, pos:'ZAG', foto:BASE+'BRUNO-SANTANA.jpg.webp' },
    { id:19, name:'Luís Oyama', short:'OYAMA', num:8, pos:'MEI', foto:BASE+'LUIS-OYAMA.jpg.webp' },
    { id:20, name:'Léo Naldi', short:'L. NALDI', num:7, pos:'MEI', foto:BASE+'LEO-NALDI.jpg.webp' },
    { id:21, name:'Rômulo', short:'RÔMULO', num:10, pos:'MEI', foto:BASE+'ROMULO.jpg.webp' },
    { id:22, name:'Matheus Bianqui', short:'BIANQUI', num:11, pos:'MEI', foto:BASE+'MATHEUS-BIANQUI.jpg.webp' },
    { id:23, name:'Juninho', short:'JUNINHO', num:20, pos:'MEI', foto:BASE+'JUNINHO.jpg.webp' },
    { id:24, name:'Tavinho', short:'TAVINHO', num:17, pos:'MEI', foto:BASE+'TAVINHO.jpg.webp' },
    { id:25, name:'Diego Galo', short:'D. GALO', num:29, pos:'MEI', foto:BASE+'DIEGO-GALO.jpg.webp' },
    { id:26, name:'Marlon', short:'MARLON', num:30, pos:'MEI', foto:BASE+'MARLON.jpg.webp' },
    { id:27, name:'Hector Bianchi', short:'HECTOR', num:16, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp' },
    { id:28, name:'Nogueira', short:'NOGUEIRA', num:36, pos:'MEI', foto:BASE+'NOGUEIRA.jpg.webp' },
    { id:29, name:'Luiz Gabriel', short:'L. GABRIEL', num:37, pos:'MEI', foto:BASE+'LUIZ-GABRIEL.jpg.webp' },
    { id:30, name:'Jhones Kauê', short:'J. KAUÊ', num:50, pos:'MEI', foto:BASE+'JHONES-KAUE.jpg.webp' },
    { id:31, name:'Robson', short:'ROBSON', num:9, pos:'ATA', foto:BASE+'ROBSON.jpg.webp' },
    { id:32, name:'Vinícius Paiva', short:'V. PAIVA', num:13, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp' },
    { id:33, name:'Hélio Borges', short:'H. BORGES', num:18, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp' },
    { id:34, name:'Jardiel', short:'JARDIEL', num:19, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp' },
    { id:35, name:'Nicolas Careca', short:'N. CARECA', num:21, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp' },
    { id:36, name:'Titi Ortiz', short:'TITI ORTIZ', num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
    { id:37, name:'Diego Mathias', short:'D. MATHIAS', num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
    { id:38, name:'Carlão', short:'CARLÃO', num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
    { id:39, name:'Ronald Barcellos', short:'RONALD', num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

// --- FORMAÇÕES ---
const FORMATIONS = {
    "4-3-3": [
        { id: '1', x: 50, y: 88, label: 'GOL' },
        { id: '2', x: 15, y: 70, label: 'LE' }, { id: '3', x: 38, y: 75, label: 'ZAG' }, { id: '4', x: 62, y: 75, label: 'ZAG' }, { id: '5', x: 85, y: 70, label: 'LD' },
        { id: '6', x: 30, y: 50, label: 'MEI' }, { id: '7', x: 70, y: 50, label: 'MEI' }, { id: '8', x: 50, y: 35, label: 'MEI' },
        { id: '9', x: 20, y: 18, label: 'PE' }, { id: '10', x: 50, y: 12, label: 'ATA' }, { id: '11', x: 80, y: 18, label: 'PD' }
    ],
    "4-4-2": [
        { id: '1', x: 50, y: 88, label: 'GOL' },
        { id: '2', x: 15, y: 70, label: 'LE' }, { id: '3', x: 38, y: 75, label: 'ZAG' }, { id: '4', x: 62, y: 75, label: 'ZAG' }, { id: '5', x: 85, y: 70, label: 'LD' },
        { id: '6', x: 25, y: 45, label: 'MEI' }, { id: '7', x: 42, y: 50, label: 'MEI' }, { id: '8', x: 58, y: 50, label: 'MEI' }, { id: '9', x: 75, y: 45, label: 'MEI' },
        { id: '10', x: 40, y: 15, label: 'ATA' }, { id: '11', x: 60, y: 15, label: 'ATA' }
    ],
    "3-5-2": [
        { id: '1', x: 50, y: 88, label: 'GOL' },
        { id: '2', x: 30, y: 75, label: 'ZAG' }, { id: '3', x: 50, y: 78, label: 'ZAG' }, { id: '4', x: 70, y: 75, label: 'ZAG' },
        { id: '5', x: 12, y: 45, label: 'ALA' }, { id: '6', x: 35, y: 50, label: 'MEI' }, { id: '7', x: 50, y: 55, label: 'MEI' }, { id: '8', x: 65, y: 50, label: 'MEI' }, { id: '9', x: 88, y: 45, label: 'ALA' },
        { id: '10', x: 40, y: 18, label: 'ATA' }, { id: '11', x: 60, y: 18, label: 'ATA' }
    ],
    "4-2-3-1": [
        { id: '1', x: 50, y: 88, label: 'GOL' },
        { id: '2', x: 15, y: 70, label: 'LE' }, { id: '3', x: 38, y: 75, label: 'ZAG' }, { id: '4', x: 62, y: 75, label: 'ZAG' }, { id: '5', x: 85, y: 70, label: 'LD' },
        { id: '6', x: 40, y: 55, label: 'VOL' }, { id: '7', x: 60, y: 55, label: 'VOL' },
        { id: '8', x: 25, y: 35, label: 'MEI' }, { id: '9', x: 50, y: 32, label: 'MEI' }, { id: '10', x: 75, y: 35, label: 'MEI' },
        { id: '11', x: 50, y: 12, label: 'ATA' }
    ],
    "3-4-3": [
        { id: '1', x: 50, y: 88, label: 'GOL' },
        { id: '2', x: 30, y: 75, label: 'ZAG' }, { id: '3', x: 50, y: 78, label: 'ZAG' }, { id: '4', x: 70, y: 75, label: 'ZAG' },
        { id: '5', x: 20, y: 50, label: 'MEI' }, { id: '6', x: 40, y: 52, label: 'MEI' }, { id: '7', x: 60, y: 52, label: 'MEI' }, { id: '8', x: 80, y: 50, label: 'MEI' },
        { id: '9', x: 25, y: 18, label: 'ATA' }, { id: '10', x: 50, y: 12, label: 'ATA' }, { id: '11', x: 75, y: 18, label: 'ATA' }
    ],
    "5-3-2": [
        { id: '1', x: 50, y: 88, label: 'GOL' },
        { id: '2', x: 12, y: 68, label: 'LAT' }, { id: '3', x: 31, y: 75, label: 'ZAG' }, { id: '4', x: 50, y: 78, label: 'ZAG' }, { id: '5', x: 69, y: 75, label: 'ZAG' }, { id: '6', x: 88, y: 68, label: 'LAT' },
        { id: '7', x: 30, y: 48, label: 'MEI' }, { id: '8', x: 50, y: 52, label: 'MEI' }, { id: '9', x: 70, y: 48, label: 'MEI' },
        { id: '10', x: 40, y: 18, label: 'ATA' }, { id: '11', x: 60, y: 18, label: 'ATA' }
    ]
};

// --- COMPONENTES AUXILIARES ---

function MarketCard({ player, onClick }: { player: Player; onClick: () => void }) {
    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex flex-col bg-[#111] rounded-xl overflow-hidden border border-white/10 active:border-yellow-500 shadow-xl"
        >
            <div className="relative aspect-square overflow-hidden bg-zinc-800">
                <img src={player.foto} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-yellow-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded">
                    {player.pos}
                </div>
            </div>
            <div className="p-2 bg-black text-center">
                <p className="text-white font-black text-[10px] uppercase truncate leading-none">{player.short}</p>
                <p className="text-yellow-500 font-bold text-[9px] mt-1">#{player.num}</p>
            </div>
        </motion.div>
    );
}

export default function ArenaTigreFC() {
    const [step, setStep] = useState<Step>('arena');
    const [formationKey, setFormationKey] = useState<keyof typeof FORMATIONS>("4-3-3");
    const [lineup, setLineup] = useState<Lineup>({});
    const [bench, setBench] = useState<(Player | null)[]>([null, null, null, null, null]);
    const [activeSlot, setActiveSlot] = useState<{ type: 'titular' | 'reserva', id: string | number } | null>(null);

    const currentSlots = FORMATIONS[formationKey];
    const filledTitulares = Object.values(lineup).filter(Boolean).length;
    const filledReservas = bench.filter(Boolean).length;
    const isBenchTime = filledTitulares === 11;

    const handleSelectPlayer = (player: Player) => {
        if (!activeSlot) return;
        if (activeSlot.type === 'titular') {
            setLineup(prev => ({ ...prev, [activeSlot.id]: player }));
        } else {
            const newBench = [...bench];
            newBench[activeSlot.id as number] = player;
            setBench(newBench);
        }
        setActiveSlot(null);
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const triggerBoom = () => {
        const colors = ['#F5C400', '#FFF', '#FFD700'];
        colors.forEach((c, i) => {
            setTimeout(() => {
                const f = document.createElement('div');
                f.className = "fixed inset-0 z-[9999] pointer-events-none bg-yellow-500/20 animate-pulse";
                document.body.appendChild(f);
                setTimeout(() => f.remove(), 400);
            }, i * 250);
        });
        setTimeout(() => setStep('summary'), 1200);
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-yellow-500">
            <AnimatePresence mode="wait">
                {step === 'arena' && (
                    <div className="flex flex-col lg:flex-row min-h-screen">
                        
                        {/* 🏟️ CAMPO FIXO NO TOPO (MOBILE) */}
                        <div className="sticky top-0 lg:relative z-40 w-full lg:flex-1 h-[60vh] lg:h-screen bg-zinc-900 border-b lg:border-b-0 border-white/10 shadow-2xl">
                            <div className="absolute inset-0">
                                <img src={STADIUM_BG} className="w-full h-full object-cover opacity-40" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
                            </div>

                            <div className="relative h-full flex flex-col items-center justify-center p-2" style={{ perspective: '1200px' }}>
                                {/* SELETOR DE TATICA NO CAMPO */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-50 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/10 overflow-x-auto max-w-[90vw] no-scrollbar">
                                    {Object.keys(FORMATIONS).map((f) => (
                                        <button 
                                            key={f}
                                            onClick={() => setFormationKey(f as keyof typeof FORMATIONS)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black transition-all whitespace-nowrap
                                            ${formationKey === f ? 'bg-yellow-500 text-black' : 'text-white/40 hover:text-white'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>

                                <motion.div 
                                    layout
                                    style={{ rotateX: 12 }} 
                                    className="relative w-full max-w-[420px] aspect-[10/13] bg-green-900/5 border-[2px] border-white/20 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                >
                                    {currentSlots.map(s => (
                                        <motion.div 
                                            key={s.id} 
                                            layoutId={s.id}
                                            className="absolute -translate-x-1/2 -translate-y-1/2" 
                                            style={{ left: `${s.x}%`, top: `${s.y}%` }}
                                        >
                                            <motion.div 
                                                onClick={() => setActiveSlot({ type: 'titular', id: s.id })}
                                                className={`w-11 h-15 lg:w-16 lg:h-20 rounded-xl border-2 flex items-center justify-center transition-all overflow-hidden
                                                ${activeSlot?.id === s.id ? 'border-yellow-500 shadow-[0_0_15px_#F5C400] scale-110' : 'border-white/20 bg-black/60'}`}
                                            >
                                                {lineup[s.id] ? (
                                                    <img src={lineup[s.id]?.foto} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[8px] font-black text-white/30 tracking-tighter">{s.label}</span>
                                                )}
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>

                        {/* 🛒 ÁREA DE ESCOLHA ABAIXO */}
                        <div className="relative z-30 w-full lg:w-[450px] flex flex-col bg-[#050505]">
                            
                            {/* BANCO DE RESERVAS */}
                            <div className={`p-6 border-b border-white/5 transition-all duration-500
                                ${isBenchTime && filledReservas < 5 ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-black'}`}>
                                <h3 className={`text-center font-black tracking-widest text-[9px] mb-4 uppercase
                                    ${isBenchTime ? 'text-yellow-500 animate-pulse' : 'text-white/20'}`}>
                                    {isBenchTime ? '🐯 Complete seu banco (5 jogadores)' : 'Escale os 11 para abrir o banco'}
                                </h3>
                                <div className="flex justify-between gap-2 max-w-sm mx-auto">
                                    {bench.map((p, i) => (
                                        <motion.div
                                            key={i}
                                            animate={activeSlot?.id === i && activeSlot.type === 'reserva' ? { scale: 1.1, borderColor: '#F5C400' } : {}}
                                            onClick={() => isBenchTime && setActiveSlot({ type: 'reserva', id: i })}
                                            className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center overflow-hidden transition-all
                                            ${activeSlot?.id === i ? 'border-yellow-500' : 'border-white/5'}
                                            ${!isBenchTime ? 'opacity-20 grayscale' : 'cursor-pointer bg-zinc-900 shadow-lg'}`}
                                        >
                                            {p ? <img src={p.foto} className="w-full h-full object-cover" /> : <span className="text-yellow-500/40 text-xl font-black">+</span>}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* BARRA DE MERCADO */}
                            <div className="sticky top-[60vh] lg:top-0 z-50 p-4 bg-yellow-500 text-black flex justify-between items-center shadow-xl">
                                <span className="font-black italic tracking-tighter">ELENCO DISPONÍVEL</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-black animate-ping" />
                                    <span className="text-[10px] font-black uppercase">
                                        {activeSlot ? `Slot: ${activeSlot.id}` : 'Selecione no campo'}
                                    </span>
                                </div>
                            </div>

                            {/* LISTA DE JOGADORES */}
                            <div className="p-4 grid grid-cols-3 gap-3 bg-black">
                                {PLAYERS.map(p => (
                                    <MarketCard key={p.id} player={p} onClick={() => handleSelectPlayer(p)} />
                                ))}
                            </div>

                            {/* BOTÃO FINALIZAR */}
                            <div className="p-6 bg-black pb-12 lg:pb-6">
                                <button 
                                    onClick={triggerBoom}
                                    disabled={filledTitulares < 11 || filledReservas < 5}
                                    className={`w-full py-5 rounded-2xl font-black italic tracking-widest text-lg transition-all shadow-2xl
                                    ${filledTitulares === 11 && filledReservas === 5 ? 'bg-yellow-500 text-black scale-100 active:scale-95' : 'bg-zinc-900 text-white/10'}`}
                                >
                                    FINALIZAR ESCALAÇÃO 🐯
                                </button>
                                <p className="text-center text-white/20 text-[9px] mt-4 uppercase font-bold tracking-widest">
                                    {filledTitulares}/11 Titulares • {filledReservas}/5 Reservas
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'summary' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-zinc-950">
                        <img src={ESCUDO} className="w-24 mb-6 drop-shadow-[0_0_20px_rgba(245,196,0,0.3)]" />
                        <h2 className="text-4xl font-black italic text-yellow-500 mb-2 tracking-tighter">TIME DEFINIDO!</h2>
                        <p className="text-white/40 text-sm mb-10 font-medium">Qual seu palpite para o jogo?</p>
                        
                        <div className="flex items-center gap-4 mb-12">
                            <div className="bg-zinc-900/50 p-5 rounded-[2.5rem] border-2 border-yellow-500 shadow-2xl">
                                <span className="block text-[10px] font-black mb-2 opacity-50 uppercase tracking-widest text-yellow-500">TIGRE</span>
                                <input type="number" defaultValue="0" className="w-16 bg-transparent text-center text-5xl font-black focus:outline-none text-white" />
                            </div>
                            <span className="text-2xl font-black opacity-10 italic uppercase">vs</span>
                            <div className="bg-zinc-900/50 p-5 rounded-[2.5rem] border-2 border-white/5 shadow-2xl">
                                <span className="block text-[10px] font-black mb-2 opacity-30 uppercase tracking-widest">ADV</span>
                                <input type="number" defaultValue="0" className="w-16 bg-transparent text-center text-5xl font-black focus:outline-none text-white/50" />
                            </div>
                        </div>

                        <button className="bg-yellow-500 text-black px-12 py-5 rounded-full font-black italic tracking-tighter hover:scale-105 transition-all shadow-[0_10px_40px_rgba(245,196,0,0.2)]">
                            GERAR MEU CARD DO TORCEDOR 📱
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
