import React, { forwardRef } from 'react';
import { Phone, Mail, MapPin, Linkedin, Github } from 'lucide-react';

const ResumeTemplate = forwardRef(({ data }, ref) => {
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
        themeColor = "rgb(0, 43, 127)",
        secondaryColor = "rgb(249, 107, 7)",
    } = data || {};

    return (
        <div ref={ref} className="bg-white px-14 w-[210mm] mx-auto text-gray-800 font-['Arial'] min-h-[297mm] break-words">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');

                @media print {
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                }
            `}</style>

            {/* Wrap content in table to ensure similar top/bottom margins on every page */}
            <table className="w-full">
                <thead>
                    <tr>
                        <td>
                            {/* Top Margin Spacer (approx 48px ~ 12 Tailwind spacing) */}
                            <div className="h-[24px]">&nbsp;</div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {/* Header */}
                            <div className="mb-4">
                                <h1 className="uppercase mb-0 tracking-tight" style={{ fontWeight: 700, fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif', color: themeColor, fontSize: '30px', lineHeight: 1 }}>{name}</h1>
                                <h2 className="mb-2" style={{ fontWeight: 700, fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif', color: secondaryColor, fontSize: '15px', lineHeight: '21px' }}>{designation}</h2>

                                <div className="flex flex-wrap gap-x-5 gap-y-1 items-center" style={{
                                    fontFamily: '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                    fontSize: '12px',
                                    lineHeight: '16px',
                                    color: '#3e3e3e',
                                    fontWeight: 700
                                }}>
                                    {phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={12} style={{ height: '12px', color: secondaryColor }} strokeWidth={2.5} />
                                            <span>{phone}</span>
                                        </div>
                                    )}
                                    {email && (
                                        <div className="flex items-center gap-1.5">
                                            <span style={{ fontSize: '12px', height: '12px', color: secondaryColor, fontWeight: 'bold', lineHeight: '12px' }}>@</span>
                                            <span>{email}</span>
                                        </div>
                                    )}
                                    {linkedin && (
                                        <div className="flex items-center gap-1.5">
                                            <Linkedin size={12} style={{ height: '12px', color: secondaryColor }} strokeWidth={2.5} />
                                            <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {linkedin.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                    {github && (
                                        <div className="flex items-center gap-1.5">
                                            <Github size={12} style={{ height: '12px', color: secondaryColor }} strokeWidth={2.5} />
                                            <a href={github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {github.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={12} style={{ height: '12px', color: secondaryColor }} strokeWidth={2.5} />
                                            <span>{location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-300 mb-4"></div>

                            {/* Dynamic Sections */}
                            {(() => {
                                const defaultOrder = ['summary', 'skills', 'experience', 'projects', 'education', 'strengths'];
                                const order = data?.sectionOrder || defaultOrder;
                                const sections = {
                                    summary: summary && (
                                        <div className="mb-4">
                                            <h3 className="uppercase mb-1.5 border-b border-transparent inline-block tracking-wide" style={{ whiteSpace: 'pre-wrap', fontWeight: 700, fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif', color: themeColor, fontSize: '16px', lineHeight: '22px' }}>SUMMARY</h3>
                                            <div className="text-gray-600 font-medium"
                                                style={{
                                                    fontFamily: "'Open Sans', sans-serif",
                                                    fontSize: '11px',
                                                    lineHeight: '1.5',
                                                    fontWeight: 400,
                                                }}
                                            >
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
                                    skills: skills && skills.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="uppercase mb-2 text-left tracking-wide" style={{ whiteSpace: 'pre-wrap', fontWeight: 700, fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif', color: themeColor, fontSize: '16px', lineHeight: '22px' }}>SKILLS</h3>
                                            <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                                                {skills.map((skill, index) => {
                                                    if (skill === '__BREAK__') {
                                                        return <div key={index} className="basis-full h-0"></div>;
                                                    }
                                                    return (
                                                        <span key={index} style={{
                                                            whiteSpace: 'pre-wrap',
                                                            fontFamily: '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                            fontSize: '12px',
                                                            lineHeight: '12px',
                                                            marginBottom: '9px',
                                                            color: '#3e3e3e',
                                                            fontWeight: 700,
                                                            minWidth: '4px',
                                                            background: 'transparent',
                                                            border: '1px solid transparent',
                                                            borderBottom: '1px solid #a9a9a9',
                                                            padding: '5px 8px'
                                                        }}>{skill}</span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ),
                                    experience: experience && experience.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="uppercase mb-3 text-left tracking-wide" style={{ whiteSpace: 'pre-wrap', fontWeight: 700, fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif', color: themeColor, fontSize: '16px', lineHeight: '22px' }}>EXPERIENCE</h3>
                                            <div className="relative">
                                                {experience.map((exp, index) => (
                                                    <div key={index} className="flex gap-4 mb-3">
                                                        {/* Left Column: Date and Location */}
                                                        <div className="w-[120px] shrink-0 pt-0.5 text-left border-r border-gray-300 relative pr-3">
                                                            <p style={{
                                                                fontFamily: '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                                color: themeColor,
                                                                fontSize: '12px',
                                                                lineHeight: '18px',
                                                                fontWeight: 700
                                                            }}>
                                                                {exp.startDate} - {exp.endDate || 'Present'}
                                                            </p>
                                                            <p className="mt-0.5 text-gray-600" style={{
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                                fontSize: '11px',
                                                                lineHeight: '16px'
                                                            }}>{exp.location}</p>

                                                            {/* Dot on timeline */}
                                                            <div className="absolute right-[-4px] top-1.5 w-2 h-2 bg-black rounded-full z-10 border border-white"></div>
                                                        </div>

                                                        {/* Right Column: Details */}
                                                        <div className="flex-1 pb-1">
                                                            <h4 className="mb-0.5" style={{
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                                color: themeColor,
                                                                fontSize: '13px',
                                                                lineHeight: '18px',
                                                                fontWeight: 400,
                                                                overflowWrap: 'break-word'
                                                            }}>{exp.title}</h4>
                                                            <h5 className="mb-1" style={{
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                                color: secondaryColor,
                                                                fontSize: '12px',
                                                                // lineHeight: '17px',
                                                                fontWeight: 700,
                                                                overflowWrap: 'break-word'
                                                            }}>{exp.company}</h5>

                                                            {exp.companyDescription && (
                                                                <p className="text-gray-600 mb-1" style={{
                                                                    whiteSpace: 'pre-wrap',
                                                                    fontFamily: "'Open Sans', sans-serif",
                                                                    fontSize: '11px',
                                                                    lineHeight: '11px',
                                                                    overflowWrap: 'break-word'
                                                                }}>{exp.companyDescription}</p>
                                                            )}

                                                            <ul className="list-disc pl-5 text-gray-600 font-medium" style={{
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                                textAlign: 'left',
                                                                fontSize: '11px',
                                                                lineHeight: '16px',
                                                                overflowWrap: 'break-word'
                                                            }}>
                                                                {exp.description && exp.description.split('\n').map((line, i) =>
                                                                    line.trim() === '' ? (
                                                                        <li key={i} className="list-none h-3 -ml-5"></li>
                                                                    ) : (
                                                                        <li key={i} className="pl-1 mb-0.5">
                                                                            <span className="relative left-[-2px]" style={{
                                                                                fontFamily: "'Open Sans', sans-serif",
                                                                                fontSize: '11px',
                                                                                lineHeight: '1.5',
                                                                                fontWeight: 400
                                                                            }}>{line.replace(/^[•\.-]\s*/, '')}</span>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                    projects: projects && projects.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="uppercase mb-3 text-left tracking-wide" style={{ whiteSpace: 'pre-wrap', fontWeight: 700, fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif', color: themeColor, fontSize: '16px', lineHeight: '22px' }}>PROJECTS</h3>
                                            <div className="space-y-4">
                                                {projects.map((proj, index) => (
                                                    <div key={index}>
                                                        <h4 className="mb-0.5" style={{
                                                            whiteSpace: 'pre-wrap',
                                                            fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                            color: themeColor,
                                                            fontSize: '13px',
                                                            lineHeight: '18px',
                                                            // fontWeight: 500
                                                        }}>{proj.title}</h4>
                                                        <div className="mb-1.5" style={{
                                                            whiteSpace: 'pre-wrap',
                                                            fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                            color: secondaryColor,
                                                            fontSize: '12px',
                                                            lineHeight: '17px',
                                                            fontWeight: 700
                                                        }}>
                                                            {proj.teamSize && <span>Team size: {proj.teamSize} </span>}
                                                            {proj.role && <span>Role: {proj.role}</span>}
                                                        </div>

                                                        {proj.description && (
                                                            <p className="text-gray-600 mb-2" style={{
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: "'Open Sans', sans-serif",
                                                                fontSize: '11px',
                                                                lineHeight: '1.5',
                                                                fontWeight: 400,
                                                                textAlign: 'left'
                                                            }}>
                                                                {proj.description}
                                                            </p>
                                                        )}

                                                        {proj.contributions && (
                                                            <div className="mb-2">
                                                                <p className="font-bold text-gray-800 mb-0.5" style={{
                                                                    fontFamily: '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                                    paddingLeft: '0',
                                                                    textAlign: 'left',
                                                                    fontSize: '12px',
                                                                    lineHeight: '16px',
                                                                    fontWeight: 700,
                                                                    color: "#3e3e3e"
                                                                }}>Key Features:</p>
                                                                <ul className="list-disc pl-5 text-gray-600" style={{
                                                                    whiteSpace: 'pre-wrap',
                                                                    fontFamily: '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                                    textAlign: 'left',
                                                                    fontSize: '11px',
                                                                    lineHeight: '16px',
                                                                    overflowWrap: 'break-word'
                                                                }}>
                                                                    {proj.contributions.split('\n').map((line, i) =>
                                                                        line.trim() === '' ? (
                                                                            <li key={i} className="list-none h-3 -ml-5"></li>
                                                                        ) : (
                                                                            <li key={i} className="pl-1 mb-0.5">
                                                                                <span className="relative left-[-2px]" style={{
                                                                                    fontFamily: "'Open Sans', sans-serif",
                                                                                    fontSize: '11px',
                                                                                    lineHeight: '1.5',
                                                                                    fontWeight: 400
                                                                                }}>{line.replace(/^[•\.-]\s*/, '')}</span>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {proj.technologies && (
                                                            <div style={{
                                                                fontFamily: '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                                textAlign: 'left',
                                                                fontSize: '12px',
                                                                lineHeight: '16px',
                                                                fontWeight: 700,
                                                                color: "#3e3e3e"
                                                            }}>
                                                                <div className="mb-0.5">Technologies Used: </div>
                                                                <div className="text-gray-600 font-normal" style={{ whiteSpace: 'pre-wrap', fontSize: '11px' }}>{proj.technologies}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                    education: education && education.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="uppercase mb-3 text-left tracking-wide" style={{ whiteSpace: 'pre-wrap', fontWeight: 700, fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif', color: themeColor, fontSize: '16px', lineHeight: '22px' }}>EDUCATION</h3>
                                            <div className="relative">
                                                {education.map((edu, index) => (
                                                    <div key={index} className="flex gap-4 mb-3">
                                                        <div className="w-[120px] shrink-0 pt-0.5 text-left border-r border-gray-300 relative pr-3">
                                                            {edu.date && <p style={{
                                                                fontFamily: '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                                color: themeColor,
                                                                fontSize: '12px',
                                                                lineHeight: '18px',
                                                                fontWeight: 700
                                                            }}>{edu.date}</p>}
                                                            <p className="mt-0.5 text-gray-600" style={{
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                                fontSize: '11px',
                                                                lineHeight: '16px'
                                                            }}>{edu.location}</p>
                                                            <div className="absolute right-[-4px] top-1.5 w-2 h-2 bg-black rounded-full z-10 border border-white"></div>
                                                        </div>
                                                        <div className="flex-1 pb-1">
                                                            <h4 className="mb-0.5" style={{
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                                color: themeColor,
                                                                fontSize: '13px',
                                                                lineHeight: '18px'
                                                            }}>{edu.degree}</h4>
                                                            <h5 className="mb-1" style={{
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                                color: secondaryColor,
                                                                fontSize: '12px',
                                                                lineHeight: '17px',
                                                                fontWeight: 700
                                                            }}>{edu.university}</h5>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                    strengths: strengths && (
                                        <div className="mb-4">
                                            <h3 className="uppercase mb-3 text-left tracking-wide" style={{ whiteSpace: 'pre-wrap', fontWeight: 700, fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif', color: themeColor, fontSize: '16px', lineHeight: '22px' }}>STRENGTHS</h3>
                                            <div className="flex items-start gap-2">
                                                <div className="mt-0.5" style={{ color: secondaryColor }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#002060] mb-1" style={{
                                                        whiteSpace: 'pre-wrap',
                                                        fontFamily: 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif',
                                                        color: themeColor,
                                                        fontSize: '13px',
                                                        lineHeight: '17px',
                                                        fontWeight: 700
                                                    }}>Major Strengths</h4>
                                                    <p className="text-gray-600" style={{
                                                        whiteSpace: 'pre-wrap',
                                                        fontFamily: "'Open Sans', sans-serif",
                                                        fontSize: '11px',
                                                        lineHeight: '1.5',
                                                        fontWeight: 400,
                                                        textAlign: 'left'
                                                    }}>
                                                        {strengths}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                };
                                return order.map(k => sections[k] ? <React.Fragment key={k}>{sections[k]}</React.Fragment> : null);
                            })()}
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            {/* Bottom Margin Spacer */}
                            <div className="h-[24px]">&nbsp;</div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
});

ResumeTemplate.displayName = 'ResumeTemplate';
export default ResumeTemplate;
