import React, { forwardRef } from 'react';
import { Phone, Mail, MapPin, Linkedin, Github, Briefcase, Award, GraduationCap, Code, Target } from 'lucide-react';

const ResumeTemplateFour = forwardRef(({ data }, ref) => {
    const {
        name = "",
        designation = "",
        phone = "",
        email = "",
        linkedin = "",
        github = "",
        location = "",
        summary = "",
        skills = [],
        experience = [],
        projects = [],
        education = [],
        strengths = "",
    } = data || {};

    return (
        <div ref={ref} className="w-[210mm] min-h-[297mm] mx-auto bg-white px-12 shadow-sm break-words relative overflow-hidden" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                
                @media print {
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .no-break {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    thead { 
                        display: table-header-group; 
                    }
                    tfoot { 
                        display: table-footer-group; 
                    }
                }

                /* Premium Glass Effect for Header Only */
                .glass-header {
                    background: linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.95) 0%, 
                        rgba(255, 255, 255, 0.88) 50%,
                        rgba(240, 249, 255, 0.92) 100%);
                    backdrop-filter: blur(30px) saturate(200%);
                    -webkit-backdrop-filter: blur(30px) saturate(200%);
                    border: 1px solid rgba(255, 255, 255, 0.9);
                    box-shadow: 
                        0 8px 32px rgba(31, 38, 135, 0.18),
                        0 2px 8px rgba(59, 130, 246, 0.12),
                        inset 0 1px 0 rgba(255, 255, 255, 1),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.6);
                }
            `}</style>

            {/* Vibrant Background for Glass Effect - Header Area Only */}
            <div className="absolute top-0 left-0 w-full h-56 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 -z-10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-400 to-blue-500 rounded-full blur-[120px] opacity-50 -z-10"></div>
            <div className="absolute top-32 left-0 w-80 h-80 bg-gradient-to-tr from-violet-500 to-purple-600 rounded-full blur-[100px] opacity-40 -z-10"></div>

            {/* Table structure for consistent page margins */}
            <table className="w-full">
                <thead>
                    <tr>
                        <td>
                            {/* Top Margin Spacer - 48px */}
                            <div className="h-[48px]">&nbsp;</div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {/* GLASS HEADER - Enhanced Design */}
                            <header className="glass-header p-8 mb-6 relative overflow-hidden -mx-12 px-20 -mt-12 pt-20">
                                {/* Decorative Elements Inside Header */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-full blur-2xl"></div>

                                <div className="relative z-10 flex justify-between items-start gap-8">
                                    {/* Left: Name & Title */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-1.5 h-20 bg-gradient-to-b from-blue-600 via-indigo-600 to-violet-600 rounded-full shadow-lg"></div>
                                            <div>
                                                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 tracking-tight leading-tight mb-2">
                                                    {name}
                                                </h1>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-px w-12 bg-gradient-to-r from-blue-600 to-transparent"></div>
                                                    <p className="text-sm font-bold text-blue-600 uppercase tracking-[0.3em]">
                                                        {designation}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Contact Info */}
                                    <div className="flex flex-col gap-2.5">
                                        {phone && (
                                            <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80 shadow-sm">
                                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                    <Phone size={12} className="text-white" strokeWidth={2.5} />
                                                </div>
                                                <span className="text-xs font-semibold text-slate-700">{phone}</span>
                                            </div>
                                        )}
                                        {email && (
                                            <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80 shadow-sm">
                                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                    <Mail size={12} className="text-white" strokeWidth={2.5} />
                                                </div>
                                                <span className="text-xs font-semibold text-slate-700">{email}</span>
                                            </div>
                                        )}
                                        {location && (
                                            <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80 shadow-sm">
                                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                                    <MapPin size={12} className="text-white" strokeWidth={2.5} />
                                                </div>
                                                <span className="text-xs font-semibold text-slate-700">{location}</span>
                                            </div>
                                        )}
                                        <div className="flex gap-3 mt-1 justify-end">
                                            {linkedin && (
                                                <a href={linkedin} className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md">
                                                    <Linkedin size={14} className="text-white" strokeWidth={2} />
                                                </a>
                                            )}
                                            {github && (
                                                <a href={github} className="p-2 bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors shadow-md">
                                                    <Github size={14} className="text-white" strokeWidth={2} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </header>

                            {/* CLEAN CONTENT SECTIONS - Simple White Background */}
                            <div className="flex flex-col gap-4">

                                {/* SUMMARY */}
                                {summary && (
                                    <div className="no-break">
                                        <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg -mx-12 pl-15">
                                            <Target size={16} className="text-blue-600" strokeWidth={2.5} />
                                            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                                                Professional Summary
                                            </h2>
                                        </div>
                                        <p className="text-sm leading-relaxed text-slate-700 mt-2">
                                            {summary}
                                        </p>
                                    </div>
                                )}

                                {/* EXPERIENCE */}
                                {experience.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg -mx-12 pl-15">
                                            <Briefcase size={16} className="text-blue-600" strokeWidth={2.5} />
                                            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                                                Professional Experience
                                            </h2>
                                        </div>
                                        <div className="space-y-4 mt-3">
                                            {experience.map((exp, i) => (
                                                <div key={i} className="no-break">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <h3 className="text-base font-bold text-slate-900">{exp.title}</h3>
                                                            <p className="text-sm font-semibold text-blue-600">{exp.company}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-bold text-slate-600">
                                                                {exp.startDate} - {exp.endDate || 'Present'}
                                                            </span>
                                                            <p className="text-xs font-medium text-slate-500">{exp.location}</p>
                                                        </div>
                                                    </div>
                                                    <ul className="space-y-1 mt-2">
                                                        {exp.description && exp.description.split('\n').filter(l => l.trim()).map((line, idx) => (
                                                            <li key={idx} className="text-sm text-slate-700 flex items-start gap-2 leading-relaxed">
                                                                <span className="text-blue-600 mt-1">•</span>
                                                                <span>{line.replace(/^[•\.-]\s*/, '')}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* SKILLS */}
                                {skills.length > 0 && (
                                    <div className="no-break">
                                        <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg -mx-12 pl-15">
                                            <Award size={16} className="text-blue-600" strokeWidth={2.5} />
                                            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                                                Core Competencies
                                            </h2>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {skills.map((skill, i) => (
                                                <span key={i} className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* PROJECTS */}
                                {projects.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg -mx-12 pl-15">
                                            <Code size={16} className="text-blue-600" strokeWidth={2.5} />
                                            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                                                Featured Projects
                                            </h2>
                                        </div>
                                        <div className="space-y-3 mt-3">
                                            {projects.map((proj, i) => (
                                                <div key={i} className="no-break">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                                                        {proj.role && <span className="text-xs font-semibold text-blue-600 uppercase">{proj.role}</span>}
                                                    </div>
                                                    {proj.technologies && (
                                                        <p className="text-xs font-medium text-slate-500 mb-1">{proj.technologies}</p>
                                                    )}
                                                    {proj.description && (
                                                        <p className="text-sm text-slate-700 leading-relaxed">{proj.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* EDUCATION */}
                                {education.length > 0 && (
                                    <div className="no-break">
                                        <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg -mx-12 pl-15">
                                            <GraduationCap size={16} className="text-blue-600" strokeWidth={2.5} />
                                            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                                                Academic Background
                                            </h2>
                                        </div>
                                        <div className="space-y-3 mt-3">
                                            {education.map((edu, i) => (
                                                <div key={i} className="no-break flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-sm font-bold text-slate-900">{edu.degree}</h3>
                                                        <p className="text-sm font-medium text-blue-600">{edu.university}</p>
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-600">{edu.date}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* STRENGTHS */}
                                {strengths && (
                                    <div className="no-break mt-2">
                                        <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg -mx-12 pl-15">
                                            <Target size={16} className="text-blue-600" strokeWidth={2.5} />
                                            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                                                Professional Statement
                                            </h2>
                                        </div>
                                        <p className="text-sm text-slate-700 italic leading-relaxed mt-2">
                                            "{strengths}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            {/* Bottom Margin Spacer - 48px */}
                            <div className="h-[48px]">&nbsp;</div>
                        </td>
                    </tr>
                </tfoot>
            </table >
        </div >
    );
});

ResumeTemplateFour.displayName = 'ResumeTemplateFour';
export default ResumeTemplateFour;
