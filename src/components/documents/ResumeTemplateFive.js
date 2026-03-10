import React, { forwardRef } from 'react';
import { Phone, Mail, Globe, Linkedin, Github, Briefcase, Award, GraduationCap, Code, Target } from 'lucide-react';

const ResumeTemplateFive = forwardRef(({ data }, ref) => {
    const {
        name = "",
        designation = "",
        email = "",
        phone = "",
        linkedin = "",
        github = "",
        location = "",
        summary = "",
        skills = [],
        experience = [],
        projects = [],
        education = [],
        strengths = "",
        themeColor = "#111827",
        sectionOrder = ['personal', 'summary', 'skills', 'experience', 'projects', 'education', 'strengths']
    } = data || {};

    // Helper to split text into bullets
    const getBullets = (text) => {
        if (!text) return [];
        return text.split('\n');
    };

    const overviewBullets = getBullets(summary);
    const functionalBullets = getBullets(strengths);

    // Helper to render text with bold tags
    const renderWithBold = (text) => {
        if (!text) return text;
        const parts = text.split(/(<b>.*?<\/b>)/g);
        return parts.map((part, index) => {
            if (part.startsWith('<b>') && part.endsWith('</b>')) {
                return <span key={index} className="font-bold">{part.replace(/<\/?b>/g, '')}</span>;
            }
            return part;
        });
    };

    const SectionHeader = ({ title }) => (
        <div className="mb-4">
            <h2 className="text-center font-bold text-lg tracking-wide" style={{ color: themeColor }}>{title}</h2>
            <div className="border-t-[2px] w-full mt-2 mb-4" style={{ borderColor: themeColor }}></div>
        </div>
    );

    const renderSection = (sectionId) => {
        switch (sectionId) {
            case 'summary':
                return (
                    <div className="mb-6 break-inside-avoid">
                        <SectionHeader title="An Overview" />
                        <ul className="list-none pl-0 space-y-1 text-[13px] text-left">
                            {overviewBullets.length > 0 ? (
                                overviewBullets.map((item, index) => (
                                    item.trim() === '' ? <div key={index} className="h-3"></div> : (
                                        <li key={index} className="flex items-start">
                                            <span className="mr-3 font-bold text-lg leading-4" style={{ color: "#000" }}>•</span>
                                            <span className="flex-1">{renderWithBold(item.replace(/^•\s*/, ''))}</span>
                                        </li>
                                    )
                                ))
                            ) : (
                                <li className="flex items-start">
                                    <span className="mr-3 font-bold text-lg leading-4" style={{ color: "#000" }}>•</span>
                                    <span className="flex-1">{summary}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                );

            case 'skills':
                return (
                    <div className="mb-6 break-inside-avoid">
                        <SectionHeader title="Skill Set" />
                        <div className="text-[13px]">
                            {/* Technical */}
                            <div className="mb-6">
                                <h3 className="font-bold underline mb-3 text-[14px]">Technical:</h3>
                                <div className="grid grid-cols-[180px_auto_1fr] gap-y-1">
                                    {(data.resumeSixSkills || []).map((skill, index) => (
                                        <React.Fragment key={skill.id || index}>
                                            <div className="font-medium">{skill.label}</div>
                                            <div className="font-bold px-2">:</div>
                                            <div style={{ whiteSpace: 'pre-wrap' }}>{skill.value}</div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'strengths':
                if (!strengths || strengths.trim() === "") return null;
                return (
                    <div className="mb-6 break-inside-avoid">
                        <h3 className="font-bold underline mb-2 text-[14px]">Strengths:</h3>
                        <ul className="list-none pl-0 space-y-1 text-left text-[13px]">
                            {functionalBullets.map((item, index) => (
                                item.trim() === '' ? <div key={index} className="h-3"></div> : (
                                    <li key={index} className="flex items-start">
                                        <span className="mr-3 font-bold text-lg leading-4" style={{ color: "#000" }}>•</span>
                                        <span className="flex-1">{item.replace(/^•\s*/, '')}</span>
                                    </li>
                                )
                            ))}
                        </ul>
                    </div>
                );

            case 'experience':
                return experience && experience.length > 0 && (
                    <div className="mb-6">
                        <SectionHeader title="Professional Experience" />
                        <div className="space-y-5">
                            {experience.map(exp => (
                                <div key={exp.id} className="mb-4 break-inside-avoid">
                                    <div className="flex items-center mb-0.5">
                                        <div className="w-2 h-2 rounded-full mr-3 shrink-0" style={{ backgroundColor: "#000" }}></div>
                                        <div className="font-bold text-[15px]">{exp.company}</div>
                                    </div>
                                    <div className="pl-5 font-bold text-[13px] mb-2" style={{ color: themeColor }}>
                                        {exp.title}
                                    </div>

                                    <ul className="list-none pl-5 space-y-1 text-[13px] text-left">
                                        {getBullets(exp.description).map((item, i) => (
                                            item.trim() === '' ? <div key={i} className="h-3"></div> : (
                                                <li key={i} className="flex items-start">
                                                    <span className="mr-3 leading-4">-</span>
                                                    <span className="flex-1">{renderWithBold(item.replace(/^[-•]\s*/, ''))}</span>
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'projects':
                return projects && projects.length > 0 && (
                    <div className="mb-6">
                        <SectionHeader title="Major Projects Overview" />
                        <div className="space-y-6">
                            {projects.map(proj => (
                                <div key={proj.id} className="mb-4 break-inside-avoid relative pl-5">
                                    {/* Bullet */}
                                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#000" }}></div>

                                    {/* Content */}
                                    <div>
                                        <div className="font-bold text-[15px] mb-1 leading-snug">{proj.title}</div>
                                        <div className="text-[13px] mb-1 text-left leading-snug">
                                            {proj.description && proj.description.split('\n').map((line, i) => (
                                                line.trim() === '' ? <div key={i} className="h-2"></div> : <div key={i}>{line}</div>
                                            ))}
                                        </div>

                                        {proj.contributions && (
                                            <ul className="list-none pl-0 space-y-1 text-[13px] text-left mb-2">
                                                {getBullets(proj.contributions).map((item, i) => (
                                                    item.trim() === '' ? <div key={i} className="h-3"></div> : (
                                                        <li key={i} className="flex items-start">
                                                            <span className="mr-2 leading-4">-</span>
                                                            <span className="flex-1">{item.replace(/^[-•]\s*/, '')}</span>
                                                        </li>
                                                    )
                                                ))}
                                            </ul>
                                        )}

                                        {proj.technologies && (
                                            <div className="text-[13px] mt-1">
                                                <span className="font-bold" style={{ color: themeColor }}>Environment: </span>
                                                <span>{proj.technologies}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'education':
                return education && education.length > 0 && (
                    <div className="mb-6 break-inside-avoid">
                        <SectionHeader title="Academic Credentials" />
                        <div className="space-y-2 text-[13px]">
                            {education.map(edu => (
                                <div key={edu.id} className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold">{edu.degree}</div>
                                        <div>
                                            {edu.university && <span>{edu.university}</span>}
                                            {edu.university && edu.location && <span>, </span>}
                                            {edu.location && <span>{edu.location}</span>}
                                        </div>
                                    </div>
                                    <div className="font-medium whitespace-nowrap">{edu.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div ref={ref} className="resume-container w-[210mm] min-h-[297mm] mx-auto bg-white px-16 py-12 shadow-sm break-words text-black leading-snug" style={{ fontFamily: "Calibri, Arial, sans-serif" }}>
            <style>
                {`
                    @media print {
                        @page {
                            margin: 10mm;
                        }
                        .resume-container {
                            padding: 0 !important;
                            box-shadow: none !important;
                        }
                    }
                `}
            </style>

            {/* Header Section */}
            <div className="mb-8 border-b-2 pb-6" style={{ borderColor: themeColor }}>
                <h1 className="text-4xl font-extrabold mb-4 tracking-tight" style={{ color: themeColor }}>{name}</h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] font-semibold text-gray-700">
                    {email && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center border" style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                                <Mail size={14} strokeWidth={2.5} />
                            </div>
                            <span>{email}</span>
                        </div>
                    )}
                    {phone && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center border" style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                                <Phone size={14} strokeWidth={2.5} />
                            </div>
                            <span>{phone}</span>
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
                            <span>
                                {linkedin.replace(/^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '') || 'LinkedIn'}
                            </span>
                        </a>
                    )}
                    {github && (
                        <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity whitespace-nowrap">
                            <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center border" style={{ color: themeColor, borderColor: `${themeColor}20` }}>
                                <Github size={14} strokeWidth={2.5} />
                            </div>
                            <span>
                                {github.replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//, '').replace(/\/$/, '') || 'GitHub'}
                            </span>
                        </a>
                    )}
                </div>
            </div>

            {/* Content Sections - Dynamic Ordering */}
            <div className="grid grid-cols-1 gap-1">
                {sectionOrder.filter(id => id !== 'personal').map(sectionId => (
                    <React.Fragment key={sectionId}>
                        {renderSection(sectionId)}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
});

ResumeTemplateFive.displayName = 'ResumeTemplateFive';
export default ResumeTemplateFive;

