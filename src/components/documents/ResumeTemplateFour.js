import React, { forwardRef } from 'react';
import { Phone, Mail, MapPin, Globe, Linkedin, Github, Briefcase, Award, GraduationCap, Code, Target } from 'lucide-react';

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
        themeColor = "#0891b2",
    } = data || {};

    return (
        <div ref={ref} className="w-[210mm] min-h-[297mm] mx-auto bg-white px-12 shadow-sm break-words relative overflow-hidden" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            <style>{`
                // @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');

                
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



            {/* Table structure for consistent page margins */}
            <table className="w-full">
                <thead>
                    <tr>
                        <td>
                            <div className="h-[38px]">&nbsp;</div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {/* GLASS HEADER - Enhanced Design */}
                            <header className="px-8 py-6 -mx-12 mb-6 shadow-sm border-b border-x" style={{
                                background: `linear-gradient(to bottom right, ${themeColor}08, ${themeColor}05, #ffffff)`,
                                borderBottomColor: `${themeColor}20`,
                                borderLeftColor: 'transparent',
                                borderRightColor: 'transparent'
                            }}>
                                <div className="flex flex-col items-start">
                                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-1" style={{ whiteSpace: 'pre-wrap' }}>
                                        {name}
                                    </h1>
                                    <p className="text-lg font-semibold tracking-wide mb-4 px-3 py-1 bg-white/60 rounded-lg inline-block" style={{ whiteSpace: 'pre-wrap', color: themeColor }}>
                                        {designation}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] font-semibold text-slate-700">
                                        {phone && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center border" style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                                                    <Phone size={14} strokeWidth={2.5} />
                                                </div>
                                                <span>{phone}</span>
                                            </div>
                                        )}
                                        {email && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center border" style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                                                    <Mail size={14} strokeWidth={2.5} />
                                                </div>
                                                <span>{email}</span>
                                            </div>
                                        )}
                                        {location && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center border" style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                                                    <Globe size={14} strokeWidth={2.5} />
                                                </div>
                                                <span>{location}</span>
                                            </div>
                                        )}
                                        {linkedin && (
                                            <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity whitespace-nowrap">
                                                <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center border" style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                                                    <Linkedin size={14} strokeWidth={2.5} />
                                                </div>
                                                <span style={{ color: themeColor }}>
                                                    {linkedin.replace(/^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '') || 'LinkedIn'}
                                                </span>
                                            </a>
                                        )}
                                        {github && (
                                            <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity whitespace-nowrap">
                                                <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center border" style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                                                    <Github size={14} strokeWidth={2.5} />
                                                </div>
                                                <span style={{ color: themeColor }}>
                                                    {github.replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//, '').replace(/\/$/, '') || 'GitHub'}
                                                </span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </header>

                            {/* CLEAN CONTENT SECTIONS - Dynamic Ordering */}
                            <div className="flex flex-col px-12">
                                {(() => {
                                    const defaultOrder = ['summary', 'skills', 'experience', 'projects', 'education', 'strengths'];
                                    const order = data?.sectionOrder || defaultOrder;

                                    const sections = {
                                        summary: summary && (
                                            <div className="no-break mb-5">
                                                <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg -mx-12 pl-15" style={{ background: `linear-gradient(to right, ${themeColor}15, ${themeColor}10)` }}>
                                                    <Target size={16} style={{ color: themeColor }} strokeWidth={2.5} />
                                                    <h2 className="font-bold tracking-wide" style={{ fontSize: '15px', color: themeColor }}>
                                                        Professional Summary
                                                    </h2>
                                                </div>
                                                <div className="mt-2 text-slate-700" style={{
                                                    fontFamily: "'Open Sans', sans-serif",
                                                    fontSize: '11px',
                                                    lineHeight: '1.5',
                                                    fontWeight: 400,
                                                    whiteSpace: 'pre-wrap'
                                                }}>
                                                    {summary.split('\n').map((line, i) =>
                                                        line.trim() === '' ? (
                                                            <div key={i} className="h-3"></div>
                                                        ) : (
                                                            <p key={i} className="mb-0">{line}</p>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                        skills: skills.length > 0 && (
                                            <div className="no-break mb-5">
                                                <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg -mx-12 pl-15 overflow-hidden" style={{ background: `linear-gradient(to right, ${themeColor}15, ${themeColor}10)` }}>
                                                    <Award size={16} style={{ color: themeColor }} strokeWidth={2.5} />
                                                    <h2 className="font-bold tracking-wide" style={{ fontSize: '15px', color: themeColor }}>
                                                        Skills
                                                    </h2>
                                                </div>
                                                <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2">
                                                    {skills.map((skill, i) => {
                                                        if (skill === '__BREAK__') {
                                                            return <div key={i} className="basis-full h-0"></div>;
                                                        }
                                                        return (
                                                            <span key={i} className="font-bold text-slate-700 px-3 py-1 border-b" style={{ fontSize: '14px', whiteSpace: 'pre-wrap', borderBottomColor: `${themeColor}40` }}>
                                                                {skill}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ),
                                        experience: experience.length > 0 && (
                                            <div className="mb-5">
                                                <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg -mx-12 pl-15" style={{ background: `linear-gradient(to right, ${themeColor}15, ${themeColor}10)` }}>
                                                    <Briefcase size={16} style={{ color: themeColor }} strokeWidth={2.5} />
                                                    <h2 className="font-bold tracking-wide" style={{ fontSize: '15px', color: themeColor }}>
                                                        Experience
                                                    </h2>
                                                </div>
                                                <div className="space-y-4 mt-2">
                                                    {experience.map((exp, i) => (
                                                        <div key={i} className="no-break">
                                                            <div className="mb-2">
                                                                <h3 className="font-bold text-slate-900" style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>{exp.title}</h3>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <p className="font-semibold" style={{ fontSize: '13px', whiteSpace: 'pre-wrap', color: themeColor }}>{exp.company}</p>
                                                                    {exp.startDate && (
                                                                        <>
                                                                            <span className="text-slate-400">•</span>
                                                                            <span className="font-semibold text-slate-600" style={{ fontSize: '11px' }}>
                                                                                {exp.startDate} - {exp.endDate || 'Present'}
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {exp.companyDescription && (
                                                                <p className="text-slate-700 mb-2 border-t border-b border-slate-300 py-2 mt-1" style={{
                                                                    fontFamily: "'Open Sans', sans-serif",
                                                                    fontSize: '11px',
                                                                    lineHeight: '1.5',
                                                                    fontWeight: 400,
                                                                    textAlign: 'justify',
                                                                    whiteSpace: 'pre-wrap'
                                                                }}>
                                                                    {exp.companyDescription}
                                                                </p>
                                                            )}

                                                            <ul className="list-disc pl-5 text-slate-700 font-medium" style={{
                                                                fontFamily: "'Open Sans', sans-serif",
                                                                fontSize: '11px',
                                                                lineHeight: '16px',
                                                                overflowWrap: 'break-word',
                                                            }}>
                                                                {exp.description.split('\n').map((line, idx) =>
                                                                    line.trim() === '' ? (
                                                                        <li key={idx} className="list-none h-3 -ml-5"></li>
                                                                    ) : (
                                                                        <li key={idx} className="pl-1 mb-0.5">
                                                                            <span className="relative left-[-2px]" style={{
                                                                                fontFamily: "'Open Sans', sans-serif",
                                                                                fontSize: '11px',
                                                                                lineHeight: '1.5',
                                                                                fontWeight: 400,
                                                                                whiteSpace: 'pre-wrap',
                                                                            }}>{line.replace(/^[•\.-]\s*/, '')}</span>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ),
                                        projects: projects.length > 0 && (
                                            <div className="mb-5">
                                                <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg -mx-12 pl-15" style={{ background: `linear-gradient(to right, ${themeColor}15, ${themeColor}10)` }}>
                                                    <Code size={16} style={{ color: themeColor }} strokeWidth={2.5} />
                                                    <h2 className="font-bold tracking-wide" style={{ fontSize: '15px', color: themeColor }}>
                                                        Projects
                                                    </h2>
                                                </div>
                                                <div className="space-y-4 mt-2">
                                                    {projects.map((proj, i) => (
                                                        <div key={i} className="no-break">
                                                            <div className="mb-2">
                                                                <h3 className="font-bold text-slate-900" style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>{proj.title}</h3>
                                                                {proj.role && (
                                                                    <p className="font-medium text-slate-600 mt-0.5" style={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>{proj.role}</p>
                                                                )}
                                                            </div>

                                                            {proj.description && (
                                                                <p className="text-slate-700 mb-2 border-t border-b border-slate-300 py-2 mt-1" style={{
                                                                    fontFamily: "'Open Sans', sans-serif",
                                                                    fontSize: '11px',
                                                                    lineHeight: '1.5',
                                                                    fontWeight: 400,
                                                                    textAlign: 'justify',
                                                                    whiteSpace: 'pre-wrap'
                                                                }}>
                                                                    {proj.description}
                                                                </p>
                                                            )}

                                                            {proj.contributions && (
                                                                <div className="mb-2">
                                                                    <p className="font-bold text-slate-800 mb-0.5" style={{
                                                                        fontFamily: "'Open Sans', sans-serif",
                                                                        fontSize: '12px',
                                                                        lineHeight: '16px',
                                                                        fontWeight: 700
                                                                    }}>Key Features:</p>
                                                                    <ul className="list-disc pl-5 text-slate-700" style={{
                                                                        fontFamily: "'Open Sans', sans-serif",
                                                                        fontSize: '11px',
                                                                        lineHeight: '16px',
                                                                        overflowWrap: 'break-word'
                                                                    }}>
                                                                        {proj.contributions.split('\n').map((line, idx) =>
                                                                            line.trim() === '' ? (
                                                                                <li key={idx} className="list-none h-3 -ml-5"></li>
                                                                            ) : (
                                                                                <li key={idx} className="pl-1 mb-0.5">
                                                                                    <span className="relative left-[-2px]" style={{
                                                                                        fontFamily: "'Open Sans', sans-serif",
                                                                                        fontSize: '11px',
                                                                                        lineHeight: '1.5',
                                                                                        fontWeight: 400,
                                                                                        whiteSpace: 'pre-wrap'
                                                                                    }}>{line.replace(/^[•\.-]\s*/, '')}</span>
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {proj.technologies && (
                                                                <div className="font-bold text-slate-800" style={{
                                                                    fontFamily: "'Open Sans', sans-serif",
                                                                    fontSize: '12px',
                                                                    lineHeight: '16px',
                                                                    fontWeight: 700
                                                                }}>
                                                                    <div className="mb-0.5">Technologies Used:</div>
                                                                    <div className="text-slate-700 font-normal" style={{
                                                                        whiteSpace: 'pre-wrap',
                                                                        fontSize: '11px',
                                                                        fontWeight: 400
                                                                    }}>{proj.technologies}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ),
                                        education: education.length > 0 && (
                                            <div className="no-break mb-5">
                                                <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg -mx-12 pl-15" style={{ background: `linear-gradient(to right, ${themeColor}15, ${themeColor}10)` }}>
                                                    <GraduationCap size={16} style={{ color: themeColor }} strokeWidth={2.5} />
                                                    <h2 className="font-bold tracking-wide" style={{ fontSize: '15px', color: themeColor }}>
                                                        Academic Background
                                                    </h2>
                                                </div>
                                                <div className="space-y-4 mt-3">
                                                    {education.map((edu, i) => (
                                                        <div key={i} className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-slate-900" style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>{edu.degree}</h3>
                                                                <p className="font-medium" style={{ fontSize: '13px', whiteSpace: 'pre-wrap', color: themeColor }}>{edu.university}</p>
                                                            </div>
                                                            <span className="font-semibold text-slate-600" style={{ fontSize: '11px' }}>{edu.date}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ),
                                        strengths: strengths && (
                                            <div className="no-break mb-5">
                                                <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg -mx-12 pl-15" style={{ background: `linear-gradient(to right, ${themeColor}15, ${themeColor}10)` }}>
                                                    <Target size={16} style={{ color: themeColor }} strokeWidth={2.5} />
                                                    <h2 className="font-bold tracking-wide" style={{ fontSize: '15px', color: themeColor }}>
                                                        Professional Statement
                                                    </h2>
                                                </div>
                                                <p className="mt-2 text-slate-700" style={{
                                                    fontFamily: "'Open Sans', sans-serif",
                                                    fontSize: '11px',
                                                    lineHeight: '1.5',
                                                    fontWeight: 400,
                                                    whiteSpace: 'pre-wrap'
                                                }}>
                                                    {strengths}
                                                </p>
                                            </div>
                                        ),
                                    };

                                    return order.map(sectionId => sections[sectionId] || null);
                                })()}
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
