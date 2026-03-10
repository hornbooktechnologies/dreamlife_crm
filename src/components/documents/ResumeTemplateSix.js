import React, { forwardRef } from 'react';

const ResumeTemplateSix = forwardRef(({ data }, ref) => {
    const {
        name = "",
        designation = "",
        experience_years = "4+",
        experience = [],
        projects = [],
        education = [],
        coreCompetencies = [],
        // Categorized skills from data
        resumeSixLanguages,
        resumeSixFrameworks,
        resumeSixStateManagement,
        resumeSixDataViz,
        resumeSixApi,
        resumeSixDatabase,
        resumeSixCloud,
        resumeSixBuildTools,
        resumeSixThirdParty,
        resumeSixDevTools,
        resumeSixTesting,
        resumeSixCiCd,
        resumeSixVersionControl,
        resumeSixProjectManagement,
        // Dynamic Section Labels
        coreCompetenciesLabel = "CORE COMPETENCIES",
        skillsLabel = "SKILLS",
        experienceLabel = "EXPERIENCE",
        projectsLabel = "RECENT PROJECTS",
        educationLabel = "EDUCATION",
        strengthsLabel = "STRENGTHS",
        experienceYearsLabel = "Years of experience",
        themeColor = "#1a4594",
        strengths = "",
    } = data || {};

    const skillCategories = data.resumeSixSkills && data.resumeSixSkills.length > 0
        ? data.resumeSixSkills
        : [
            { id: 1, label: "Languages", value: resumeSixLanguages || "JavaScript (ES6+), TypeScript, HTML5, CSS3, PHP" },
            { id: 2, label: "Framework & APIs", value: resumeSixFrameworks || "ReactJS, NextJS, Redux, Express.js, NodeJS, RESTful APIs, GraphQL, JSX, Ajax" },
            { id: 3, label: "State Management", value: resumeSixStateManagement || "Redux, React Context API, React Hooks, Jotai, React Query" },
            { id: 4, label: "Data Visualization & SDKs", value: resumeSixDataViz || "ChartJS, Ant Design Chart, Carbon Planner SDKs, Google Maps API, WebSocket SDK, Amcharts" },
            { id: 5, label: "API Integrations", value: resumeSixApi || "Axios, React Query, REST APIs, GraphQL, Firebase, JWT Authentication, Stripe" },
            { id: 6, label: "Database", value: resumeSixDatabase || "MySQL, MongoDB" },
            { id: 7, label: "Cloud Services", value: resumeSixCloud || "AWS Lambda, AWS Cognito" },
            { id: 8, label: "Software Build & Tools", value: resumeSixBuildTools || "Babel, Webpack, NPM, Yarn, ESLint, Prettier" },
            { id: 9, label: "3rd Party services", value: resumeSixThirdParty || "Storybook, Auth0, MaterialUI, Styled Components, Stripe, PayPal, Authorize.net (via eCommerce integrations), Google Maps, Figma, Sketch" },
            { id: 10, label: "Development Tools", value: resumeSixDevTools || "VS Code, Postman, MongoDB Compass" },
            { id: 11, label: "Testing", value: resumeSixTesting || "Jest, React Testing Library" },
            { id: 12, label: "CI/CD Tools", value: resumeSixCiCd || "Circle CI" },
            { id: 13, label: "Version Control", value: resumeSixVersionControl || "Git, Bitbucket, GitHub" },
            { id: 14, label: "Project management", value: resumeSixProjectManagement || "Zoho, Slack, MS Teams, JIRA, Trello" }
        ];

    const getCoreCompetencies = () => {
        if (Array.isArray(coreCompetencies) && coreCompetencies.length > 0) return coreCompetencies;
        if (typeof coreCompetencies === 'string' && coreCompetencies.length > 0) {
            // Keep empty lines for spacing
            return coreCompetencies.split('\n');
        }
        return [
            "Skilled in developing clean, modular, and maintainable UI components using React's component-based architecture to support scalability and code reuse.",
            "Strong command of managing both local and global state efficiently using React Hooks, Redux, and Context API, ensuring responsive and consistent application behavior.",
            "Proficient in building mobile-first, pixel-perfect interfaces using HTML5, CSS3, and Material UI, while adhering to accessibility best practices (WCAG standards).",
            "Experienced in integrating RESTful APIs and GraphQL, managing asynchronous operations with tools like Axios and React Query, and implementing robust error handling strategies.",
            "Knowledgeable in performance tuning techniques including lazy loading, code splitting, memoization, and image optimization to deliver fast, smooth user experiences.",
            "Familiar with writing unit and integration tests using tools like Jest and Enzyme, and adept at identifying and resolving issues throughout the development lifecycle.",
            "Proficient in using Git and platforms like GitHub or Bitbucket for source control; experienced in working in Agile teams using tools such as JIRA for sprint and task management.",
            "Experienced with front-end tooling such as Webpack, Babel, npm/yarn, and capable of configuring optimized build processes for development and production environments."
        ];
    };

    const displayCoreCompetencies = getCoreCompetencies();

    return (
        <div ref={ref} className="resume-six-container shadow-lg resume-six-shadow text-black break-words">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Barlow:wght@400;500;600;700&family=Open+Sans:wght@400;600;700;800&display=swap');
                
                .resume-six-title {
                    font-family: 'Poppins', sans-serif;
                    color: ${themeColor};
                    font-weight: 700;
                    font-size: 34px;
                    text-transform: uppercase;
                    line-height: 1;
                    margin-bottom: 8px;
                }
                .resume-six-name-area {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 2px;
                }
                .resume-six-name {
                    font-family: 'Poppins', sans-serif;
                    font-weight: 700;
                    font-size: 20px;
                }
                .resume-six-exp {
                    font-family: 'Poppins', sans-serif;
                    font-size: 18px;
                    font-weight: 500;
                    text-transform: none;
                }
                .resume-six-header-line {
                    height: 4px;
                    background-color: ${themeColor};
                    width: 100%;
                    margin-top: 8px;
                    margin-bottom: 12px;
                }
                .resume-six-section-title {
                    font-family: 'Poppins', sans-serif;
                    color: ${themeColor};
                    font-weight: 700;
                    font-size: 24px;
                    text-transform: uppercase;
                    margin-bottom: 16px;
                }
                .resume-six-skills-grid {
                    display: grid;
                    grid-template-columns: 240px 1fr;
                }
                .resume-six-skill-label {
                    font-family: 'Barlow', sans-serif;
                    font-weight: 700;
                    font-size: 15px;
                    line-height: 1.6;
                    color: #000;
                    white-space: nowrap;
                    padding-bottom: 15px;
                    padding-right: 20px;
                }
                .resume-six-skill-value {
                    padding-left: 20px;
                    border-left: 1px solid #CACACA;
                    font-family: 'Barlow', sans-serif;
                    font-size: 15px;
                    line-height: 1.6;
                    color: #000;
                    padding-bottom: 15px;
                    margin-left: -1px; /* Overlap with grid line if any */
                    white-space: pre-wrap;
                }
                .resume-six-bullet {
                    margin-bottom: 8px;
                    padding-left: 20px; /* Reduced padding for cleaner look */
                    position: relative;
                    font-family: 'Barlow', sans-serif;
                    font-size: 15px;
                    line-height: 1.5;
                    color: #000;
                    white-space: pre-wrap;
                }
                .resume-six-bullet::before {
                    content: '';
                    position: absolute;
                    left: 6px;
                    top: 8px; /* Adjusted for centering with 1.5 line-height */
                    width: 5px;
                    height: 5px;
                    background-color: #000;
                    border-radius: 50%;
                }
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                    .resume-six-shadow { box-shadow: none; }
                }
                .resume-six-container {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 0 auto;
                    background-color: white;
                    padding: 0 15mm; /* Only horizontal padding, top/bottom handled by table */
                    box-sizing: border-box;
                }
            `}</style>

            {/* Wrap content in table to ensure same top/bottom margins on every page */}
            <table className="w-full">
                <thead>
                    <tr>
                        <td>
                            <div className="h-[10mm]">&nbsp;</div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {/* Header */}
                            <header className="mb-4">
                                <h1 className="resume-six-title">{designation || "SR. REACTJS DEVELOPER"}</h1>
                                <div className="resume-six-name-area">
                                    <span className="resume-six-name">{name || "Raxit Vaghela"}</span>
                                    <span className="text-xl">|</span>
                                    <span className="resume-six-exp">{experience_years} {experienceYearsLabel}</span>
                                </div>
                                <div className="resume-six-header-line"></div>
                            </header>

                            {/* Dynamic Sections */}
                            {(() => {
                                const defaultOrder = ['summary', 'skills', 'experience', 'projects', 'education', 'strengths'];
                                const order = data?.sectionOrder || defaultOrder;

                                const sections = {
                                    summary: (
                                        <section className="mb-6">
                                            <h2 className="resume-six-section-title" style={{ color: "#000" }}>{coreCompetenciesLabel}</h2>
                                            <div className="space-y-1">
                                                {displayCoreCompetencies.map((comp, index) => (
                                                    comp.trim() === '' ? (
                                                        <div key={index} className="h-4"></div>
                                                    ) : (
                                                        <div key={index} className="resume-six-bullet">
                                                            {comp}
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </section>
                                    ),
                                    skills: (
                                        <section className="mb-6">
                                            <h2 className="resume-six-section-title" style={{ color: "#000" }}>{skillsLabel}</h2>
                                            <div className="resume-six-skills-grid">
                                                {skillCategories.map((skill, index) => (
                                                    <React.Fragment key={index}>
                                                        <div className="resume-six-skill-label">{skill.label}</div>
                                                        <div className="resume-six-skill-value">{skill.value}</div>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </section>
                                    ),
                                    experience: experience && experience.length > 0 && experience[0].title && (
                                        <section className="mb-6">
                                            <h2 className="resume-six-section-title" style={{ color: "#000" }}>{experienceLabel}</h2>
                                            {experience.map((exp, index) => exp.title && (
                                                <div key={index} className="mb-6" style={{ fontFamily: "'Barlow', sans-serif" }}>
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h3 className="font-extrabold text-[16px] uppercase" style={{ color: themeColor }}>{exp.title}</h3>
                                                        <span className="text-[14px] font-bold">{exp.startDate} - {exp.endDate || 'Present'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-baseline mb-2">
                                                        <h4 className="font-bold text-[14px] text-gray-800">{exp.company}</h4>
                                                        <span className="text-[14px]">{exp.location}</span>
                                                    </div>
                                                    {exp.description && (
                                                        <div className="space-y-1">
                                                            {exp.description.split('\n').map((line, i) => (
                                                                line.trim() === '' ? (
                                                                    <div key={i} className="h-2"></div>
                                                                ) : (
                                                                    <div key={i} className="resume-six-bullet !text-[14px]">{line.replace(/^[•\.-]\s*/, '')}</div>
                                                                )
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </section>
                                    ),
                                    projects: projects && projects.length > 0 && projects[0].title && (
                                        <section className="mb-6">
                                            <h2 className="resume-six-section-title" style={{ color: "#000" }}>{projectsLabel}</h2>
                                            {projects.map((proj, index) => proj.title && (
                                                <div key={index} className="mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>
                                                    <h3 className="font-extrabold text-[17px] uppercase mb-2" style={{ fontFamily: "'Barlow', sans-serif", color: themeColor }}>{proj.title}</h3>

                                                    {proj.description && (
                                                        <div className="text-[14px] leading-relaxed mb-3 whitespace-pre-wrap">
                                                            <span className="font-bold">Project Brief:</span> {proj.description}
                                                        </div>
                                                    )}

                                                    {proj.roles && (
                                                        <div className="mb-3">
                                                            <div className="font-bold text-[14px] mb-2">Roles and Responsibilities:</div>
                                                            <div className="space-y-2">
                                                                {proj.roles.split('\n').map((role, i) => (
                                                                    role.trim() === '' ? (
                                                                        <div key={i} className="h-2"></div>
                                                                    ) : (
                                                                        <div key={i} className="resume-six-bullet !text-[14px]">
                                                                            {role.replace(/^[•\.-]\s*/, '')}
                                                                        </div>
                                                                    )
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {proj.technologies && (
                                                        <div className="text-[14px] leading-relaxed whitespace-pre-wrap">
                                                            <span className="font-bold">Technology Stack:</span> {proj.technologies}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </section>
                                    ),
                                    education: education && education.length > 0 && education[0].degree && (
                                        <section>
                                            <h2 className="resume-six-section-title" style={{ color: "#000" }}>{educationLabel}</h2>
                                            {education.map((edu, index) => edu.degree && (
                                                <div key={index} className="mb-4">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h3 className="font-extrabold text-[16px] uppercase" style={{ color: themeColor }}>{edu.degree}</h3>
                                                        <span className="font-bold text-[14px]">{edu.date}</span>
                                                    </div>
                                                    <div className="flex justify-between items-baseline">
                                                        <h4 className="font-bold text-[15px] text-gray-800">{edu.university}</h4>
                                                        <span className="text-[14px]">{edu.location}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </section>
                                    ),
                                    strengths: strengths && strengths.trim().length > 0 && (
                                        <section className="mb-6">
                                            <h2 className="resume-six-section-title" style={{ color: "#000" }}>{strengthsLabel}</h2>
                                            <div className="flex items-start gap-4" style={{ fontFamily: "'Barlow', sans-serif" }}>
                                                <div className="mt-1 shrink-0" style={{ color: themeColor }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[15px] mb-1" style={{ color: themeColor }}>Major Strengths</h4>
                                                    <p className="text-[14px] leading-relaxed text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>
                                                        {strengths}
                                                    </p>
                                                </div>
                                            </div>
                                        </section>
                                    ),
                                };
                                return order.map(k => sections[k] ? <React.Fragment key={k}>{sections[k]}</React.Fragment> : null);
                            })()}
                        </td>
                    </tr >
                </tbody >
                <tfoot>
                    <tr>
                        <td>
                            <div className="h-[10mm]">&nbsp;</div>
                        </td>
                    </tr>
                </tfoot>
            </table >
        </div >
    );
});

ResumeTemplateSix.displayName = 'ResumeTemplateSix';
export default ResumeTemplateSix;
