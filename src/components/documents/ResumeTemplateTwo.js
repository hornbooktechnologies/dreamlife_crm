import React, { forwardRef } from 'react';
import { Phone, Mail, MapPin, Linkedin, Github } from 'lucide-react';

const ResumeTemplateTwo = forwardRef(({ data }, ref) => {
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
        themeColor = '#124f44',
        secondaryColor = '#3cb371'
    } = data || {};

    // Font Stacks (Matched to Classic Blue)
    const fontHeader = 'Montserrat, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif';
    const fontBody = '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif';

    // Exact Colors
    const colors = {
        primary: themeColor,
        secondary: secondaryColor,
        text: '#3e3e3e',
        lightText: '#4b5563',
        bgShape: `${secondaryColor}${secondaryColor.startsWith('#') && secondaryColor.length === 7 ? '22' : ''}`,
        footerBg: `${secondaryColor}${secondaryColor.startsWith('#') && secondaryColor.length === 7 ? '22' : ''}`,
        iconBg: '#ffffff',
    };

    return (
        <div ref={ref} className="bg-transparent relative w-[210mm] min-h-[297mm] mx-auto text-gray-700" style={{ fontFamily: fontBody }}>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');

                @media print {
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print-fixed-header {
                        position: fixed !important;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 220px;
                        z-index: 0 !important;
                        display: block !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                    }
                    .print-fixed-footer {
                        position: fixed !important;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 200px;
                        z-index: 0 !important;
                        display: block !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                        -webkit-backface-visibility: hidden;
                        backface-visibility: hidden;
                        transform: translateZ(0);
                    }
                    /* Ensure table header repeats */
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                }
            `}</style>

            {/* --- HEADER BACKGROUND SHAPE --- */}
            <div className="absolute top-0 right-0 w-full h-[220px] z-0 pointer-events-none overflow-hidden print-fixed-header">
                <svg viewBox="0 0 800 220" width="100%" height="100%" preserveAspectRatio="none">
                    {/* Main Wavy Green Shape */}
                    <path d="M200,0 C 350,130 550,30 800,160 L 800,0 Z" fill={colors.bgShape} opacity="1" />

                    {/* Middle White Curve Line - Thinned Border */}
                    <path d="M280,0 C 430,90 630,-10 800,100" stroke="white" strokeWidth="1.5" fill="none" opacity="1" />
                </svg>
            </div>

            {/* --- FOOTER BACKGROUND SHAPE --- */}
            <div className="absolute bottom-0 left-0 w-full h-[200px] z-0 pointer-events-none overflow-hidden print-fixed-footer">
                <svg viewBox="0 0 800 200" width="100%" height="100%" preserveAspectRatio="none">

                    {/* Main Fill Shape - Organic Wavy Bottom Left */}
                    <path d="M0,200 L0,0 C 220,30 380,120 520,200 Z" fill={colors.footerBg} />

                    {/* Concentric White Wavy Curves */}
                    <path d="M0,60 C 200,80 340,150 450,200" stroke="white" strokeWidth="1.5" fill="none" opacity="1" />
                    <path d="M0,120 C 150,130 250,170 360,200" stroke="white" strokeWidth="1.5" fill="none" opacity="1" />
                </svg>
            </div>

            {/* --- MAIN CONTENT AS TABLE FOR REPEATING SPACERS --- */}
            <table className="w-full relative z-10">
                <thead>
                    <tr>
                        <td>
                            {/* Spacer for Header Graphic repeating on every page - Reduced to match Classic Blue */}
                            <div className="h-[24px]">&nbsp;</div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div className="px-14 h-full block break-words">

                                {/* HEADER SECTION */}
                                <div className="mb-6 relative mt-4">
                                    <h1 className="uppercase tracking-tight leading-none mb-0"
                                        style={{ fontFamily: fontHeader, color: colors.primary, fontSize: '36px', fontWeight: 800 }}>
                                        {name}
                                    </h1>
                                    <h2 className="mb-2"
                                        style={{ fontFamily: fontHeader, color: colors.secondary, fontSize: '16px', fontWeight: 700, letterSpacing: '0.5px' }}>
                                        {designation}
                                    </h2>

                                    <div className="flex flex-wrap items-center gap-x-5" style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563' }}>
                                        {phone && (
                                            <div className="flex items-center gap-1">
                                                <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center" style={{ color: colors.secondary }}>
                                                    <Phone size={13} strokeWidth={2.5} />
                                                </div>
                                                <span>{phone}</span>
                                            </div>
                                        )}
                                        {email && (
                                            <div className="flex items-center gap-1">
                                                <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center" style={{ color: colors.secondary }}>
                                                    <Mail size={13} strokeWidth={2.5} />
                                                </div>
                                                <span>{email}</span>
                                            </div>
                                        )}
                                        {linkedin && (
                                            <div className="flex items-center gap-1">
                                                <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center" style={{ color: colors.secondary }}>
                                                    <Linkedin size={13} strokeWidth={2.5} />
                                                </div>
                                                <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    {linkedin.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        )}
                                        {github && (
                                            <div className="flex items-center gap-1">
                                                <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center" style={{ color: colors.secondary }}>
                                                    <Github size={13} strokeWidth={2.5} />
                                                </div>
                                                <a href={github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    {github.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        )}
                                        {location && (
                                            <div className="flex items-center gap-1">
                                                <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center" style={{ color: colors.secondary }}>
                                                    <MapPin size={13} strokeWidth={2.5} />
                                                </div>
                                                <span>{location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* DYNAMIC SECTIONS HERE */}
                                {(() => {
                                    const defaultOrder = ['summary', 'experience', 'skills', 'projects', 'education', 'strengths'];
                                    const order = data?.sectionOrder || defaultOrder;

                                    const sections = {
                                        summary: summary && (
                                            <div className="mb-5">
                                                <h3 className="uppercase mb-1 tracking-wider"
                                                    style={{ fontFamily: fontHeader, color: colors.primary, fontSize: '15px', fontWeight: 800 }}>
                                                    SUMMARY
                                                </h3>
                                                <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '11px', lineHeight: '1.5', color: colors.lightText, fontWeight: 400, textAlign: 'justify', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                                                    {summary}
                                                </p>
                                            </div>
                                        ),
                                        experience: experience && experience.length > 0 && (
                                            <div className="mb-5">
                                                <h3 className="uppercase mb-2 tracking-wider"
                                                    style={{ fontFamily: fontHeader, color: colors.primary, fontSize: '15px', fontWeight: 800 }}>
                                                    EXPERIENCE
                                                </h3>
                                                <div className="space-y-4">
                                                    {experience.map((exp, index) => (
                                                        <div key={index} className="flex gap-4">
                                                            {/* Left Column */}
                                                            <div className="w-[125px] shrink-0 text-left relative pr-4 border-r border-[#d1d5db]">
                                                                <p style={{ color: colors.primary, fontSize: '10.5px', fontWeight: 700, fontFamily: '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif', }}>
                                                                    {exp.startDate} - {exp.endDate || 'Present'}
                                                                </p>
                                                                <p className="mt-0.5" style={{ color: colors.lightText, fontSize: '10px', fontWeight: 500, fontFamily: '"Open Sans", Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", "Noto Sans Bengali", sans-serif', }}>
                                                                    {exp.location}
                                                                </p>
                                                                <div className="absolute right-[-3.5px] top-[5px] w-[7px] h-[7px] rounded-full z-10 border border-white" style={{ backgroundColor: colors.primary }}></div>
                                                            </div>

                                                            {/* Right Column */}
                                                            <div className="flex-1 pb-1">
                                                                <h4 className="mb-0.5 leading-tight"
                                                                    style={{ fontFamily: fontHeader, color: colors.primary, fontSize: '12.5px', fontWeight: 400, whiteSpace: 'pre-wrap' }}>
                                                                    {exp.title}
                                                                </h4>
                                                                <h5 className="mb-1 leading-tight"
                                                                    style={{ fontFamily: fontHeader, color: colors.secondary, fontSize: '11.5px', fontWeight: 700, whiteSpace: 'pre-wrap' }}>
                                                                    {exp.company}
                                                                </h5>

                                                                {exp.companyDescription && (
                                                                    <p className="text-[11px] text-[#3e3e3e] mb-1">
                                                                        {exp.companyDescription}
                                                                    </p>
                                                                )}

                                                                {exp.description && (
                                                                    <div className="text-[#3e3e3e]" style={{ fontSize: '11px', lineHeight: '1.5', fontWeight: 400, fontFamily: "'Open Sans', sans-serif" }}>
                                                                        <ul className="list-disc pl-5 space-y-0.5 marker:text-[#3e3e3e]" style={{ overflowWrap: 'break-word' }}>
                                                                            {exp.description.split('\n')
                                                                                .map((line, i) => {
                                                                                    if (line.trim() === '') return <div key={i} className="h-3"></div>;

                                                                                    return (
                                                                                        <li key={i} className="pl-1">
                                                                                            <span className="" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '11px', lineHeight: '1.5', fontWeight: 400 }}>{line.replace(/^[•\.-]\s*/, '')}</span>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ),
                                        skills: skills && skills.length > 0 && (
                                            <div className="mb-5">
                                                <h3 className="uppercase mb-2 tracking-wider"
                                                    style={{ fontFamily: fontHeader, color: colors.primary, fontSize: '15px', fontWeight: 800 }}>
                                                    SKILLS
                                                </h3>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1.5 underline-offset-4">
                                                    {skills.map((skill, index) => {
                                                        if (skill === '__BREAK__') {
                                                            return <div key={index} className="basis-full h-0"></div>;
                                                        }
                                                        return (
                                                            <span key={index} className="text-[12px] font-bold text-[#4b5563] border-b-2 border-[#e5e7eb] pb-0.5">
                                                                {skill}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ),
                                        projects: projects && projects.length > 0 && (
                                            <div className="mb-5">
                                                <h3 className="uppercase mb-1 tracking-wider"
                                                    style={{ fontFamily: fontHeader, color: colors.primary, fontSize: '15px', fontWeight: 800 }}>
                                                    PROJECTS
                                                </h3>
                                                <div className="space-y-3">
                                                    {projects.map((proj, index) => (
                                                        <div key={index}>
                                                            <h4 className="mb-1"
                                                                style={{ fontFamily: fontHeader, color: colors.primary, fontSize: '12.5px', fontWeight: 400, whiteSpace: 'pre-wrap' }}>
                                                                {proj.title}
                                                            </h4>

                                                            {proj.description && (
                                                                <p className="mb-1.5 text-justify text-[#3e3e3e]" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '11px', lineHeight: '1.5', fontWeight: 400, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                                                                    {proj.description}
                                                                </p>
                                                            )}

                                                            {proj.contributions && (
                                                                <div>
                                                                    <p className="mb-0.5 font-bold text-[#3e3e3e]" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '11px', lineHeight: '1.5', fontWeight: 700 }}>Key Features:</p>
                                                                    <ul className="list-disc pl-5 space-y-0.5 marker:text-[#3e3e3e]" style={{ overflowWrap: 'break-word' }}>
                                                                        {proj.contributions.split('\n').map((line, i) => {
                                                                            if (line.trim() === '') return <div key={i} className="h-3"></div>;
                                                                            return (
                                                                                <li key={i} className='text-[#3e3e3e]' style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '11px', lineHeight: '1.5', fontWeight: 400 }}>{line.replace(/^[•\.-]\s*/, '')}</li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {proj.technologies && (
                                                                <div className="mt-1">
                                                                    <p className="font-bold text-[#3e3e3e]" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '11px', lineHeight: '1.5', fontWeight: 700 }}>Technologies Used:</p>
                                                                    <p className="text-[#3e3e3e]" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '11px', lineHeight: '1.5', fontWeight: 400, whiteSpace: 'pre-wrap' }}>{proj.technologies}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ),
                                        education: education && education.length > 0 && (
                                            <div className="mb-5">
                                                <h3 className="uppercase mb-1 tracking-wider"
                                                    style={{ fontFamily: fontHeader, color: colors.primary, fontSize: '15px', fontWeight: 800 }}>
                                                    EDUCATION
                                                </h3>
                                                <div className="space-y-2">
                                                    {education.map((edu, index) => (
                                                        <div key={index} className="flex gap-4">
                                                            <div className="w-[125px] shrink-0 text-left relative pr-4 border-r border-[#d1d5db]">
                                                                <p style={{ color: colors.primary, fontSize: '10.5px', fontWeight: 800 }}>
                                                                    {edu.date}
                                                                </p>
                                                                <p className="mt-0.5" style={{ color: '#6b7280', fontSize: '10px', fontWeight: 500 }}>
                                                                    {edu.location}
                                                                </p>
                                                                <div className="absolute right-[-3.5px] top-[5px] w-[7px] h-[7px] rounded-full z-10 border border-white" style={{ backgroundColor: colors.primary }}></div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-[12px] font-normal text-gray-700">{edu.degree}</h4>
                                                                <h5 className="text-[11px] font-bold" style={{ color: colors.secondary }}>{edu.university}</h5>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ),
                                        strengths: strengths && (
                                            <div className="mb-5">
                                                <h3 className="uppercase mb-2 tracking-wider"
                                                    style={{ fontFamily: fontHeader, color: colors.primary, fontSize: '15px', fontWeight: 800 }}>
                                                    STRENGTHS
                                                </h3>
                                                <div className="flex items-start gap-2">
                                                    <div className="mt-0.5" style={{ color: colors.secondary }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold mb-1 text-[12px]" style={{ color: colors.primary }}>Major Strengths</h4>
                                                        <p className="text-gray-600" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '11px', lineHeight: '1.5', fontWeight: 400, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                                                            {strengths}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    };

                                    return order.map(section => (
                                        <React.Fragment key={section}>
                                            {sections[section]}
                                        </React.Fragment>
                                    ));
                                })()}

                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            {/* Spacer for Footer Graphic repeating on every page */}
                            <div className="h-[24px]">&nbsp;</div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div >
    );
});

ResumeTemplateTwo.displayName = 'ResumeTemplateTwo';
export default ResumeTemplateTwo;
