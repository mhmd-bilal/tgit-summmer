"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Gamepad2, CalendarDays, Users, Star, ArrowRight, Radio, TrendingUp, FileText, Clapperboard } from 'lucide-react';
import SitcomCarousel from '@/components/SitcomCarousel';
import { useState, useEffect } from 'react';
import { scheduleData } from './schedule/page';

export default function Home() {
  const teams = useStore((state) => state.teams);

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const topTeam = sortedTeams.length > 0 ? sortedTeams[0] : null;

  const timedEvents = scheduleData.filter((e: any) => e.time !== "All Day");
  const pastEventsCount = timedEvents.filter((e: any) => currentTime > e.time).length;
  const progress = timedEvents.length > 0 && currentTime ? Math.round((pastEventsCount / timedEvents.length) * 100) : 0;

  const eventStatus = progress === 100 ? "Completed" : progress === 0 ? "Upcoming" : "Live";

  const upcomingEvents = timedEvents.filter((e: any) => e.time >= currentTime);
  const displayEvents = upcomingEvents.length > 0 ? upcomingEvents.slice(0, 3) : timedEvents.slice(-3);

  return (
    <div className="space-y-10 py-4">
      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hero-banner relative"
      >
        <div className="max-w-lg relative z-10">
          <h1 className="text-4xl md:text-5xl font-playfair font-black text-black leading-tighter mb-4">
            TGIT Sitcom<br /><span className="text-deep-purple">Season</span>
          </h1>
          <p className="text-ink-light text-base md:text-lg font-inter mb-6 max-w-md">
            Welcome to the TGIT Sitcom Games! Compete in a day filled with laughter, strategy, and teamwork inspired by your favorite sitcoms. From trivia battles to creative challenges and high-energy office races, every moment brings teams closer to victory.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/games" className="btn-warm btn-warm-fill">
              Explore Games
            </Link>
            <Link href="/teams" className="btn-warm btn-warm-outline">
              Team Standings
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 2 }}
          transition={{ delay: 0.6 }}
          className="hidden lg:block absolute -mb-25 -top-25 left-155 sticky-note max-w-[180px] z-100 rotate-0hover:rotate-2"
        >
          <span className="sticky-note-label">Note for participants</span>
          <p className="text-sm leading-snug">
            Live scores update after every game!
          </p>
        </motion.div>

        {/* Slideshow small section inside hero */}
        <motion.div
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.6 }}
          className="hidden lg:block absolute top-12 right-8 z-20"
        >
          <SitcomCarousel />
        </motion.div>


        {/* Decorative purple circle bg */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-lavender/30 rounded-full blur-3xl -z-0" />
      </motion.div>

      {/* ── Feature Cards Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            href: '/games',
            icon: <Gamepad2 size={22} />,
            iconClass: 'icon-circle-purple',
            title: 'Games',
            desc: 'Discover all TGIT challenges including Guess Who, Sitcom Trivia, Clay Modelling, Office Olympics, and the all-day Halloween Heist.',
            tags: ['5 Events', 'All-Day Heist'],
          },
          {
            href: '/schedule',
            icon: <CalendarDays size={22} />,
            iconClass: 'icon-circle-brown',
            title: 'Schedule',
            desc: 'View the complete timeline of the TGIT Sitcom Games, from morning trivia to the final Office Olympics showdown.',
            link: 'View Timeline',
          },
          {
            href: '/teams',
            icon: <Users size={22} />,
            iconClass: 'icon-circle-coral',
            title: 'Teams',
            desc: 'Meet the competing teams and track their progress across all sitcom-inspired challenges. Know your team',
            link: 'View Standings',
          },
        ].map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <Link href={card.href} className="block group">
              <div className="card-clean p-6 h-full">
                <div className={`icon-circle ${card.iconClass} mb-4`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-playfair font-bold text-ink mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-ink-light font-inter leading-relaxed mb-3">
                  {card.desc}
                </p>
                {card.tags && (
                  <div className="flex gap-2">
                    {card.tags.map(tag => (
                      <span key={tag} className="tag-pill tag-pill-olive">{tag}</span>
                    ))}
                  </div>
                )}
                {card.link && (
                  <span className="text-sm font-inter font-semibold text-ink-light group-hover:text-deep-purple transition-colors inline-flex items-center gap-1">
                    {card.link} <ArrowRight size={14} />
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── Live Ratings Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-clean p-6 md:p-8"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="live-badge mb-4">Live Scoreboard</div>
            <h2 className="text-2xl md:text-3xl font-playfair font-black text-ink mb-2">
              Event Scoreboard
            </h2>
            <p className="text-ink-light font-inter text-sm leading-relaxed mb-5 max-w-md">
              Track real-time team standings as points are earned across each TGIT game. Stay tuned to see who rises to the top by the end of the day.
            </p>
            <Link href="/scoreboard" className="btn-warm btn-warm-fill inline-flex items-center gap-2">
              <Radio size={16} />
              View Scoreboard
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:w-[280px]">
            <div className="stat-box">
              <div className="stat-box-value">{teams.length > 0 ? `${teams.length}` : '—'}</div>
              <div className="stat-box-label">Competing Teams</div>
            </div>
            <div className="stat-box relative">
              <div className="stat-box-value">{progress}%</div>
              <div className="stat-box-label">Event Progress</div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-coral-accent rounded-full border-2 border-white" />
            </div>
            <div className="stat-box">
              <div className="stat-box-value">{topTeam ? topTeam.score : '—'}</div>
              <div className="stat-box-label">Leading Score</div>
            </div>
            <div className="stat-box">
              <div className={`stat-box-value ${eventStatus === 'Live' ? 'text-mint' : 'text-ink'}`}>{eventStatus}</div>
              <div className="stat-box-label">Event Status</div>
            </div>
          </div>
        </div>

        {/* Subtle Thematic Prop Insert: Yellow Umbrella */}
        <div className="absolute top-4 right-4 text-4xl opacity-50 rotate-12 drop-shadow-md z-0 pointer-events-none">
          ☂️
        </div>
      </motion.div>

      {/* ── Daily Call Sheet + Production News ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Daily Call Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-3"
        >
          <h2 className="text-xl font-playfair font-bold text-ink italic mb-5">
            Event Highlights
          </h2>
          <div className="divider mt-0 mb-4" />

          {displayEvents.map((item: any, i: number) => {
            const IconComp = item.icon || Clapperboard;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="card-clean p-4 flex items-center gap-4 mb-4"
              >
                {/* Time */}
                <div className="text-center min-w-[60px]">
                  <div className="text-sm font-inter font-bold text-ink">
                    {item.time}
                  </div>
                  <div className="text-[0.6rem] font-inter font-semibold text-ink-light uppercase">
                    {parseInt(item.time.split(":")[0]) < 12 ? "AM" : "PM"}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-border" />

                {/* Icon */}
                <div className="avatar-circle-sm avatar-circle">
                  <IconComp size={14} />
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-inter font-semibold text-ink truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-ink-light font-inter">
                    {item.location}
                  </p>
                </div>
              </motion.div>
            )
          })}

          {/* Empty State */}
          {displayEvents.length === 0 && (
            <div className="card-clean p-8 text-center text-ink-light font-inter text-sm">
              No events scheduled yet. Please check back for the latest TGIT game updates.
            </div>
          )}
        </motion.div>

        {/* Production News */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2"
        >
          <div className="production-notes h-full">
            <h3 className="flex items-center gap-2">
              <FileText size={16} />
              Event Updates
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-coral-accent mt-2 flex-shrink-0" />
                <div>
                  <span className="text-[0.6rem] font-bold uppercase tracking-wider text-golden-bg block mb-1">Breaking News</span>
                  <p className="text-sm opacity-90">The Halloween Heist is underway! Collect and defend tokens throughout the day for the final showdown.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-golden mt-2 flex-shrink-0" />
                <div>
                  <span className="text-[0.6rem] font-bold uppercase tracking-wider text-golden-bg block mb-1">Teams Update</span>
                  <p className="text-sm opacity-90">Teams are competing across multiple challenges. Keep an eye on the scoreboard for live rankings.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-lavender mt-2 flex-shrink-0" />
                <div>
                  <span className="text-[0.6rem] font-bold uppercase tracking-wider text-golden-bg block mb-1">Event Reminder</span>
                  <p className="text-sm opacity-90">The Office Olympics begins at 5:40 PM, where the Halloween Heist winner will be announced.</p>
                </div>
              </div>
            </div>
            <Link href="/schedule" className="mt-5 block text-center py-2 rounded-lg border border-white/30 text-sm font-semibold hover:bg-white/10 transition-colors">
              View Full Schedule
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Footer tagline ── */}
      <motion.p
        className="text-xs font-inter text-ink-light/50 text-center pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        🎬 Celebrating teamwork, creativity, and the spirit of sitcoms at TGIT.
      </motion.p>
    </div>
  );
}
