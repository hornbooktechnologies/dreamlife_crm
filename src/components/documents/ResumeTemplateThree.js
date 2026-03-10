import React, { forwardRef } from 'react';
import { Phone, Mail, MapPin, Linkedin, Github } from 'lucide-react';

const ResumeTemplateThree = forwardRef(({ data }, ref) => {
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
        themeColor = "#3b82f6",
    } = data || {};

    const fontHeader = 'Montserrat, Arial, Helvetica, sans-serif';
    const fontBody = '"Open Sans", Arial, Helvetica, sans-serif';

    const colors = {
        name: '#0f172a',
        designation: themeColor,
        sectionHeader: '#0f172a',
        border: '#0f172a',
        company: themeColor,
        gray: '#64748b',
    };

    return (
        <div ref={ref} className="bg-white relative w-[210mm] min-h-[297mm] mx-auto text-gray-700" style={{ fontFamily: fontBody }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');

                @media print {
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                }
            `}</style>

            <table className="w-full">
                <thead>
                    <tr><td><div className="h-[24px]"></div></td></tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="px-14 align-top">
                            {/* HEADER */}
                            <div className="mb-6">
                                <h1 style={{ fontFamily: fontHeader, color: colors.name, fontSize: '34px' }} className="font-extrabold tracking-tight uppercase leading-none mb-1">
                                    {name}
                                </h1>
                                <h2 style={{ fontFamily: fontHeader, color: colors.designation }} className="text-xl font-bold mb-3">
                                    {designation}
                                </h2>
                                {/* Contact Info */}
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-gray-700 capitalize tracking-wide">
                                    {phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={12} style={{ color: themeColor }} />
                                            <span>{phone}</span>
                                        </div>
                                    )}
                                    {email && (
                                        <div className="flex items-center gap-1.5">
                                            <span style={{ color: themeColor }} className="text-xs font-bold">@</span>
                                            <a href={`mailto:${email}`} className="hover:underline lowercase">{email}</a>
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={12} style={{ color: themeColor }} />
                                            <span>{location}</span>
                                        </div>
                                    )}
                                    {linkedin && (
                                        <div className="flex items-center gap-1.5 lowercase">
                                            <Linkedin size={12} style={{ color: themeColor }} />
                                            <a href={linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                                                {linkedin.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                    {github && (
                                        <div className="flex items-center gap-1.5 lowercase">
                                            <Github size={12} style={{ color: themeColor }} />
                                            <a href={github} target="_blank" rel="noreferrer" className="hover:underline">
                                                {github.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* DYNAMIC SECTIONS */}
                            {(() => {
                                const defaultOrder = ['summary', 'skills', 'experience', 'projects', 'education', 'strengths'];
                                const order = data?.sectionOrder || defaultOrder;

                                const sections = {
                                    summary: summary && (
                                        <div className="mb-5">
                                            <h3 style={{ fontFamily: fontHeader, color: colors.sectionHeader, borderBottomColor: colors.border, fontSize: '16px', lineHeight: '22px' }}
                                                className="font-bold uppercase border-b-2 mb-3 pb-1">
                                                Summary
                                            </h3>
                                            <div className="text-gray-700 text-justify" style={{
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: "'Open Sans', sans-serif",
                                                fontSize: '11px',
                                                lineHeight: '1.5',
                                                fontWeight: 400
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
                                    skills: skills && skills.length > 0 && (
                                        <div className="mb-5">
                                            <h3 style={{ fontFamily: fontHeader, color: colors.sectionHeader, borderBottomColor: colors.border, fontSize: '16px', lineHeight: '22px' }}
                                                className="font-bold uppercase border-b-2 mb-3 pb-1">
                                                Skills
                                            </h3>
                                            <div className="flex flex-wrap gap-x-4 gap-y-2 font-semibold text-gray-800" style={{ fontSize: '11px' }}>
                                                {skills.map((skill, index) => {
                                                    if (skill === '__BREAK__') {
                                                        return <div key={index} className="basis-full h-0"></div>;
                                                    }
                                                    return (
                                                        <div key={index} className="border-b border-gray-300 pb-0.5 px-1">
                                                            {skill}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ),
                                    experience: experience && experience.length > 0 && (
                                        <div className="mb-5">
                                            <h3 style={{ fontFamily: fontHeader, color: colors.sectionHeader, borderBottomColor: colors.border, fontSize: '16px', lineHeight: '22px' }}
                                                className="font-bold uppercase border-b-2 mb-3 pb-1">
                                                Experience
                                            </h3>
                                            <div className="space-y-4">
                                                {experience.map((exp, index) => (
                                                    <div key={exp.id || index} className="relative pb-4 border-b border-gray-300 border-dashed last:border-0 last:pb-0">
                                                        <h4 className="font-bold text-gray-900 mb-0.5" style={{ fontFamily: fontHeader, whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: '18px' }}>
                                                            {exp.title}
                                                        </h4>

                                                        {/* Company & Date Stacked */}
                                                        <div className="mb-2">
                                                            <h5 className="font-bold" style={{ color: colors.company, fontFamily: fontHeader, whiteSpace: 'pre-wrap', fontSize: '12px', lineHeight: '17px' }}>
                                                                {exp.company}
                                                            </h5>
                                                            {(exp.startDate || exp.endDate) && (
                                                                <div className="font-semibold text-gray-500 mt-0.5 flex items-center gap-1" style={{ fontSize: '11px' }}>
                                                                    <span>📅</span> {exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {exp.companyDescription && (
                                                            <p className="text-gray-600 mb-1" style={{
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: "'Open Sans', sans-serif",
                                                                fontSize: '11px',
                                                                lineHeight: '1.5',
                                                                fontWeight: 400
                                                            }}>{exp.companyDescription}</p>
                                                        )}

                                                        {exp.description && (
                                                            <div className="text-gray-700 ml-1" style={{ fontSize: '12px', lineHeight: '16px' }}>
                                                                <ul className="list-disc pl-6 marker:text-gray-400" style={{ overflowWrap: 'break-word' }}>
                                                                    {exp.description.split('\n').map((line, i) => {
                                                                        if (line.trim() === '') {
                                                                            return <li key={i} className="list-none h-3 -ml-6"></li>;
                                                                        }
                                                                        if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('.')) {
                                                                            return <li key={i} className="pl-1 mb-0.5"><span className="relative -left-0.5" style={{
                                                                                fontFamily: "'Open Sans', sans-serif",
                                                                                fontSize: '11px',
                                                                                lineHeight: '1.5',
                                                                                fontWeight: 400
                                                                            }}>{line.replace(/^[•\.-]\s*/, '')}</span></li>;
                                                                        }
                                                                        return <li key={i} className="pl-1 list-none -ml-4 mb-0.5" style={{
                                                                            fontFamily: "'Open Sans', sans-serif",
                                                                            fontSize: '11px',
                                                                            lineHeight: '1.5',
                                                                            fontWeight: 400
                                                                        }}>{line}</li>;
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                    projects: projects && projects.length > 0 && (
                                        <div className="mb-5">
                                            <h3 style={{ fontFamily: fontHeader, color: colors.sectionHeader, borderBottomColor: colors.border, fontSize: '16px', lineHeight: '22px' }}
                                                className="font-bold uppercase border-b-2 mb-3 pb-1">
                                                Projects
                                            </h3>
                                            <div className="space-y-4">
                                                {projects.map((proj, index) => (
                                                    <div key={proj.id || index} className="relative pb-4 border-b border-gray-300 border-dashed last:border-0 last:pb-0">
                                                        <h3 className="font-bold text-gray-900 mb-0.5" style={{ fontFamily: fontHeader, whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: '18px' }}>
                                                            {proj.title}
                                                        </h3>
                                                        {proj.role && (
                                                            <div className="font-semibold text-gray-600 mb-1" style={{ fontSize: '11px' }}>
                                                                <span className="mr-3 text-black font-bold" style={{ whiteSpace: 'pre-wrap' }}>{proj.role}</span>
                                                            </div>
                                                        )}

                                                        {proj.description && (
                                                            <p className="mb-3 text-gray-700" style={{
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: "'Open Sans', sans-serif",
                                                                fontSize: '11px',
                                                                lineHeight: '1.5',
                                                                fontWeight: 400
                                                            }}>
                                                                Description: {proj.description}
                                                            </p>
                                                        )}


                                                        {proj.contributions && (
                                                            <div className="text-gray-700 ml-1" style={{ fontSize: '11px', lineHeight: '12px' }}>
                                                                <span className="font-semibold text-black">Responsibilities: </span>
                                                                <ul className="list-disc pl-6 marker:text-gray-400" style={{ overflowWrap: 'break-word' }}>
                                                                    {proj.contributions.split('\n').map((line, i) => {
                                                                        if (line.trim() === '') return <li key={i} className="list-none h-3 -ml-6"></li>;
                                                                        return <li key={i} className="pl-1 mb-0.5"><span className="relative -left-0.5" style={{
                                                                            fontFamily: "'Open Sans', sans-serif",
                                                                            fontSize: '11px',
                                                                            lineHeight: '1.5',
                                                                            fontWeight: 400
                                                                        }}>{line.replace(/^[•\.-]\s*/, '')}</span></li>;
                                                                    })}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {proj.technologies && (
                                                            <div className="mt-3 text-gray-700" style={{ fontSize: '11px', lineHeight: '16px' }}>
                                                                <span className="font-semibold text-black">Technologies: </span>
                                                                <span style={{ whiteSpace: 'pre-wrap' }}>{proj.technologies}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                    education: education && education.length > 0 && (
                                        <div className="mb-5">
                                            <h3 style={{ fontFamily: fontHeader, color: colors.sectionHeader, borderBottomColor: colors.border, fontSize: '16px', lineHeight: '22px' }}
                                                className="font-bold uppercase border-b-2 mb-3 pb-1">
                                                Education
                                            </h3>
                                            <div className="space-y-2">
                                                {education.map((edu, index) => (
                                                    <div key={index}>
                                                        <h4 className="font-bold text-gray-900" style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>{edu.degree}</h4>
                                                        <div className="font-semibold" style={{ color: themeColor, fontSize: '12px', whiteSpace: 'pre-wrap' }}>{edu.university}</div>
                                                        <div className="text-gray-500" style={{ fontSize: '11px', whiteSpace: 'pre-wrap' }}>{edu.date} {edu.location && `| ${edu.location}`}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                    strengths: strengths && (
                                        <div className="mb-5">
                                            <h3 style={{ fontFamily: fontHeader, color: colors.sectionHeader, borderBottomColor: colors.border, fontSize: '16px', lineHeight: '22px' }}
                                                className="font-bold uppercase border-b-2 mb-3 pb-1">
                                                Strengths
                                            </h3>
                                            <p className="text-gray-700 text-justify" style={{
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: "'Open Sans', sans-serif",
                                                fontSize: '11px',
                                                lineHeight: '1.5',
                                                fontWeight: 400,
                                                overflowWrap: 'break-word'
                                            }}>
                                                {strengths}
                                            </p>
                                        </div>
                                    )
                                };

                                return order.map(section => (
                                    <React.Fragment key={section}>
                                        {sections[section]}
                                    </React.Fragment>
                                ));
                            })()}


                        </td>
                    </tr>
                </tbody>
                <tfoot><tr><td><div className="h-[24px]"></div></td></tr></tfoot>
            </table>
        </div>
    );
});

ResumeTemplateThree.displayName = 'ResumeTemplateThree';
export default ResumeTemplateThree;
