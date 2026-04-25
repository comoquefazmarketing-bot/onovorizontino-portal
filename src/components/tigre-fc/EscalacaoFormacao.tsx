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

interface EscalacaoFormacaoProps {
    jogoId?: number;
}

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
        { id: '1', x: 50, y: 82, label: 'GOL' },
        { id: '2', x: 18, y: 70, label: 'LE' }, { id: '3', x: 38, y: 72, label: 'ZAG' }, { id: '4', x: 62, y: 72, label: 'ZAG' }, { id: '5', x: 82, y: 70, label: 'LD' },
        { id: '6', x: 30, y: 55, label: 'MEI' }, { id: '7', x: 70, y: 55, label: 'MEI' }, { id: '8', x: 50, y: 52, label: 'MEI' },
        { id: '9', x: 25, y: 38, label: 'PE' }, { id: '10', x: 50, y: 35, label: 'ATA' }, { id: '11', x: 75, y: 38, label: 'PD' }
    ],
    "4-4-2": [
        { id: '1', x: 50, y: 82, label: 'GOL' },
        { id: '2', x: 18, y: 70, label: 'LE' }, { id: '3', x: 38, y: 72, label: 'ZAG' }, { id: '4', x: 62, y: 72, label: 'ZAG' }, { id: '5', x: 82, y: 70, label: 'LD' },
        { id: '6', x: 22, y: 55, label: 'MEI' }, { id: '7', x: 42, y: 56, label: 'MEI' }, { id: '8', x: 58, y: 56, label: 'MEI' }, { id: '9', x: 78, y: 55, label: 'MEI' },
        { id: '10', x: 40, y: 38, label: 'ATA' }, { id: '11', x: 60, y: 38, label: 'ATA' }
    ],
    "3-5-2": [
        { id: '1', x: 50, y: 82, label: 'GOL' },
        { id: '2', x: 32, y: 72, label: 'ZAG' }, { id: '3', x: 50, y: 74, label: 'ZAG' }, { id: '4', x: 68, y: 72, label: 'ZAG' },
        { id: '5', x: 15, y: 55, label: 'ALA' }, { id: '6', x: 35, y: 56, label: 'MEI' }, { id: '7', x: 50, y: 58, label: 'MEI' }, { id: '8', x: 65, y: 56, label: 'MEI' }, { id: '9', x: 85, y: 55, label: 'ALA' },
        { id: '10', x: 42, y: 38, label: 'ATA' }, { id: '11', x: 58, y: 38, label: 'ATA' }
    ],
    "4-2-3-1": [
        { id: '1', x: 50, y: 82, label: 'GOL' },
        { id: '2', x: 18, y: 70, label: 'LE' }, { id: '3', x: 38, y: 72, label: 'ZAG' }, { id: '4', x: 62, y: 72, label: 'ZAG' }, { id: '5', x: 82, y: 70, label: 'LD' },
        { id: '6', x: 40, y: 58, label: 'VOL' }, { id: '7', x: 60, y: 58, label: 'VOL' },
        { id: '8', x: 25, y: 42, label: 'MEI' }, { id: '9', x: 50, y: 40, label: 'MEI' }, { id: '10', x: 75, y: 42, label: 'MEI' },
        { id: '11', x: 50, y: 28, label: 'ATA' }
    ],
    "3-4-3": [
        { id: '1', x: 50, y: 82, label: 'GOL' },
        { id: '2', x: 30, y: 72, label: 'ZAG' }, { id: '3', x: 50, y: 74, label: 'ZAG' }, { id: '4', x: 70, y: 72, label: 'ZAG' },
        { id: '5', x: 20, y: 55, label: 'MEI' }, { id: '6', x: 40, y: 56, label: 'MEI' }, { id: '7', x: 60, y: 56, label: 'MEI' }, { id: '8', x: 80, y: 55, label: 'MEI' },
        { id: '9', x: 25, y: 38, label: 'ATA' }, { id: '10', x: 50, y: 35, label: 'ATA' }, { id: '11', x: 75, y: 38, label: 'ATA' }
    ],
    "5-3-2": [
        { id: '1', x: 50, y: 82, label: 'GOL' },
        { id: '2', x: 12, y: 68, label: 'LAT' }, { id: '3', x: 31, y: 72, label: 'ZAG' }, { id: '4', x: 50, y: 74, label: 'ZAG' }, { id: '5', x: 69, y: 72, label: 'ZAG' }, { id: '6', x: 88, y: 68, label: 'LAT' },
        { id: '7', x: 30, y: 52, label: 'MEI' }, { id: '8', x: 50, y: 54, label: 'MEI' }, { id: '9', x: 70, y: 52, label: 'MEI' },
        { id: '10', x: 40, y: 38, label: 'ATA' }, { id: '11', x: 60, y: 38, label: 'ATA' }
    ]
};

// --- COMPONENTES AUXILIARES ---
function MarketCard({ player, onClick }: { player: Player; onClick: () => void }) {
    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex flex-col bg-[#111] rounded-xl overflow-hidden border border-white/10 active:border-yellow-500 shadow-xl cursor-pointer"
        >
            <div className="relative aspect-square overflow-hidden bg-zinc-800 flex items-center justify-center">
                <img src={player.foto} alt={player.name} className="w-full h-full object-cover object-top" />
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

export default function EscalacaoFormacao({ jogoId }: EscalacaoFormacaoProps) {
    const [step, setStep] = useState<Step>('arena');
    const [formationKey, setFormationKey] = useState<keyof typeof FORMATIONS>("4-3-3");
    const [filter, setFilter] = useState<string>('TODOS');
    const [lineup, setLineup] = useState<Lineup>({});
    const [bench, setBench] = useState<(Player | null)[]>([null, null, null, null, null]);
    const [activeSlot, setActiveSlot] = useState<{ type: 'titular' | 'reserva', id: string | number } | null>(null);

    const currentSlots = FORMATIONS[formationKey];
    const filledTitulares = Object.values(lineup).filter(Boolean).length;
    const filledReservas = bench.filter(Boolean).length;
    const isBenchTime = filledTitulares === 11;

    const filteredPlayers = useMemo(() => {
        if (filter === 'TODOS') return PLAYERS;
        return PLAYERS.filter(p => p.pos === filter);
    }, [filter]);

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
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            <AnimatePresence mode="wait">
                {step === 'arena' && (
                    <div className="flex flex-col-reverse lg:flex-row min-h-screen">
                        
                        {/* MERCADO TIGRE (ESQUERDA) */}
                        <div className="relative z-30 w-full lg:w-[450px] flex flex-col bg-[#050505] border-r border-white/10">
                            <div className="p-4 bg-yellow-500 text-black font-black italic flex justify-between items-center sticky top-0 z-50">
                                <span>MERCADO TIGRE</span>
                                <div className="text-[10px] px-2 py-1 bg-black text-yellow-500 rounded-lg">
                                    {isBenchTime ? "ESCOLHA O BANCO" : "ESCOLHA OS 11"}
                                </div>
                            </div>

                            {/* FILTROS DE POSIÇÃO */}
                            <div className="flex gap-1 overflow-x-auto p-3 bg-zinc-900/50 no-scrollbar border-b border-white/5">
                                {['TODOS', 'GOL', 'ZAG', 'LAT', 'MEI', 'ATA'].map(pos => (
                                    <button 
                                        key={pos}
                                        onClick={() => setFilter(pos)}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all whitespace-nowrap
                                        ${filter === pos ? 'bg-yellow-500 text-black' : 'bg-black text-white/40 border border-white/10'}`}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>

                            {/* BANCO DE RESERVAS */}
                            <div className="p-4 grid grid-cols-5 gap-2 bg-black border-b border-white/5">
                                {bench.map((p, i) => (
                                    <div 
                                        key={i}
                                        onClick={() => isBenchTime && setActiveSlot({ type: 'reserva', id: i })}
                                        className={`aspect-[3/4] rounded-lg border-2 flex items-center justify-center overflow-hidden transition-all cursor-pointer
                                        ${activeSlot?.id === i && activeSlot.type === 'reserva' ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10 bg-zinc-900'}`}
                                    >
                                        {p ? <img src={p.foto} className="w-full h-full object-cover object-top" /> : <span className="text-white/20 font-black">+</span>}
                                    </div>
                                ))}
                            </div>

                            {/* LISTA DE JOGADORES */}
                            <div className="p-4 grid grid-cols-3 gap-3 overflow-y-auto max-h-[50vh] lg:max-h-none lg:flex-1 no-scrollbar">
                                {filteredPlayers.map(p => (
                                    <MarketCard key={p.id} player={p} onClick={() => handleSelectPlayer(p)} />
                                ))}
                            </div>

                            <div className="p-4 bg-black">
                                <button 
                                    disabled={filledTitulares < 11 || filledReservas < 5}
                                    className={`w-full py-5 rounded-2xl font-black italic tracking-widest text-lg transition-all
                                    ${filledTitulares === 11 && filledReservas === 5 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'bg-zinc-800 text-white/10 cursor-not-allowed'}`}
                                >
                                    CONFIRMAR TIME 🐯
                                </button>
                            </div>
                        </div>

                        {/* ÁREA DO CAMPO (DIREITA) */}
                        <div className="relative z-40 w-full lg:flex-1 h-[65vh] lg:h-screen bg-black overflow-hidden">
                            <div className="absolute inset-0">
                                <img src={STADIUM_BG} alt="Arena Tigre FC" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            </div>

                            {/* PERSPECTIVA DO CAMPO */}
                            <div className="relative h-full w-full" style={{ perspective: '1200px' }}>
                                <div 
                                    className="absolute inset-0" 
                                    style={{ 
                                        transform: 'rotateX(20deg)', 
                                        transformOrigin: 'bottom center'
                                    }}
                                >
                                    {currentSlots.map(s => {
                                        const scaleBase = (s.y / 100) * 0.7 + 0.4;
                                        return (
                                            <motion.div 
                                                key={s.id} 
                                                layout 
                                                className="absolute -translate-x-1/2 -translate-y-1/2" 
                                                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                                            >
                                                <motion.div 
                                                    onClick={() => setActiveSlot({ type: 'titular', id: s.id })}
                                                    animate={{ 
                                                        scale: activeSlot?.id === s.id ? scaleBase + 0.15 : scaleBase 
                                                    }}
                                                    className={`relative w-16 h-22 lg:w-24 lg:h-32 rounded-xl border-2 flex flex-col items-center justify-center transition-all shadow-2xl overflow-hidden
                                                    ${activeSlot?.id === s.id ? 'border-yellow-500 shadow-[0_0_30px_#F5C400]' : 'border-white/30 bg-black/40 backdrop-blur-md'}`}
                                                >
                                                    {lineup[s.id] ? (
                                                        <>
                                                            <img src={lineup[s.id]?.foto} className="w-full h-full object-cover object-top" alt="Player" />
                                                            <div className="absolute bottom-0 w-full bg-yellow-500 text-black text-[9px] font-black py-1 text-center uppercase tracking-tighter">
                                                                {lineup[s.id]?.short}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-yellow-500 text-2xl font-black">+</span>
                                                            <span className="text-[8px] font-black text-white/50 uppercase">{s.label}</span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* SELETOR DE FORMAÇÃO */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1 z-50 bg-black/90 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 overflow-x-auto max-w-[90vw] no-scrollbar">
                                {Object.keys(FORMATIONS).map((f) => (
                                    <button 
                                        key={f}
                                        onClick={() => setFormationKey(f as keyof typeof FORMATIONS)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap
                                        ${formationKey === f ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-white/40 hover:text-white'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
