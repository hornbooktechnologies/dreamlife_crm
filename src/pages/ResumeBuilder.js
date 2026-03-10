import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Trash2, Plus, GripVertical, Printer, Upload, FileText, Loader2, Download } from 'lucide-react';
import ResumeTemplate from '../components/documents/ResumeTemplate';
import ResumeTemplateTwo from '../components/documents/ResumeTemplateTwo';
import ResumeTemplateThree from '../components/documents/ResumeTemplateThree';
import ResumeTemplateFour from '../components/documents/ResumeTemplateFour';
import { Card } from '../components/ui/card';

// --- Default Data for Template 1 (Classic Blue) - Raxit Vaghela ---
const classicData = {
    name: "RAXIT VAGHELA",
    designation: "Senior Frontend Developer",
    email: "raxitv27@gmail.com",
    linkedin: "https://www.linkedin.com/in/raxit-vaghela-0441a110a",
    github: "https://github.com/raxitvaghela",
    phone: "+91-9664522956",
    location: "Ahmedabad, Gujarat, India",
    summary: "A highly skilled web Developer with 10 years of professional experience, including 4+ years specializing in React.js and Next.js. Expertise in crafting high-quality, scalable, and responsive web applications using modern frontend technologies. Adept at developing user-centric interfaces, optimizing performance, and collaborating across teams to deliver robust solutions that drive business growth. Proven track record of leveraging skills in JavaScript, TypeScript, and advanced frameworks to build seamless and efficient user experiences.",
    skills: [
        "HTML", "CSS", "Javascript", "JQuery", "PHP", "Reactjs", "Redux", "Nextjs", "Nodejs", "TypeScript", "Material UI",
        "Material React Table", "Express", "API Integration", "REST api", "MySQL", "MongoDB", "GraphQL", "Firebase", "Npm",
        "WebSockets", "Jwt", "Hooks", "Jest", "Integration Testing", "AWS Lambda", "Aws Cognito", "Agile", "Axios", "Babel",
        "Git", "BitBucket", "bootstrap", "Ajax", "Debugging", "ES6", "figma", "JIRA", "JSX", "Wordpress", "Laravel"
    ],
    experience: [
        {
            id: 1,
            title: "Senior Frontend Developer",
            company: "Hornbook Technologies PVT. LTD.",
            location: "Ahmedabad, Gujarat",
            startDate: "06/2022",
            endDate: "Present",
            companyDescription: "A technology-focused company specializing in web application development.",
            description: "• Developed and maintained responsive, high-performance web applications using React.js, Redux, and Node.js.\n• Implemented responsive design principles and optimized web performance through image compression, lazy loading, and other techniques.\n• Collaborated with Back End team to design and implement RESTful APIs.\n• Created and maintained automated testing scripts using Jest.\n• Conducted code reviews and provided technical guidance to junior developers."
        },
        {
            id: 2,
            title: "Senior Frontend Developer",
            company: "Freelancing Projects",
            location: "Remote",
            startDate: "04/2020",
            endDate: "05/2022",
            companyDescription: "Engaged in multiple frontend development projects for various clients.",
            description: "• Worked with clients to understand business requirements and translate them into technical solutions.\n• Collaborated with the design team to ensure UI/UX consistency and implemented designs using HTML, CSS, and JavaScript.\n• Built reusable UI components and libraries to be used across multiple projects, increasing development efficiency.\n• Worked closely with the Back End team to integrate APIs and improve overall application performance.\n• Implemented various testing frameworks including Jest and Enzyme to ensure code quality and maintainability.\n• Developed and maintained documentation for codebase, design patterns, and best practices."
        },
        {
            id: 3,
            title: "Sr. Web/Frontend Developer",
            company: "Vishwa Infoways",
            location: "Ahmedabad, Gujarat",
            startDate: "11/2011",
            endDate: "03/2020",
            companyDescription: "A web development company focused on creating digital solutions for clients.",
            description: "• Developed and maintained multiple WordPress websites, including custom themes and plugins using PHP, HTML, CSS, and JavaScript.\n• Integrated payment gateways like PayPal, Stripe, and Authorize.net for e-commerce websites.\n• Implemented responsive designs and cross-browser compatibility using CSS frameworks like Bootstrap and MaterialUI.\n• Optimized website performance through caching, CDN, and server-side optimizations.\n• Managed source code using Git, GitHub and Bitbucket."
        }
    ],
    projects: [
        {
            id: 1,
            title: "BPP Product catalog",
            role: "Front-End Developer",
            teamSize: "32",
            description: "As a Front-End Developer for the Core Banking Product for Bank Staff, I was responsible for designing and implementing user interface components using ReactJS. The product aimed to empower bank staff to create customized financial products, including loan calculations, interest rates, and discount configurations.",
            contributions: "Developed and optimized user interface components using ReactJS to ensure high performance and fast load times.\nCollaborated closely with the UI/UX design team to create visually appealing, intuitive, and user-friendly interfaces tailored for bank staff.\nPartnered with the back-end development team to integrate front-end functionality with back-end APIs, ensuring seamless operations.\nPerformed rigorous testing and debugging to maintain the application's quality and resolve issues efficiently.\nEnsured compliance with security and privacy standards critical to banking applications.\nIncorporated accessibility features to make the application inclusive and user-friendly for all bank staff, including those with disabilities.",
            technologies: "ReactJS, HTML5/CSS3, JavaScript, Jest, Java, Git, Agile methodologies."
        },
        {
            id: 2,
            title: "Carbon Planner",
            role: "Front-End Developer",
            teamSize: "70",
            description: "As a Front-End Developer for the \"Cut the Carbon\" project, I was responsible for creating and optimizing user interface components using ReactJS. The product aimed to provide actionable insights for companies and factories to reduce their carbon footprint.",
            contributions: "Translated wireframes designed in Sketch into fully functional, reusable ReactJS components.\nIntegrated APIs to dynamically display data across various categories and implemented efficient dynamic routing.\nCollaborated with the back-end development team to seamlessly integrate front-end components with the application's backend.\nConducted thorough testing and debugging to identify and fix application issues, ensuring optimal performance.\nEnsured compliance with security and privacy regulations in all front-end implementations.\nAdded accessibility features to enhance usability for individuals with disabilities, aligning with best practices.",
            technologies: "ReactJS, Redux, Axios, React Query, Sketch, HTML5/CSS3, JavaScript, Jest, Java, Git, Agile methodologies."
        },
        {
            id: 3,
            title: "Crypto Exchange",
            role: "Front-End Developer",
            teamSize: "22",
            description: "As a Front-End Developer for the Crypto Exchange platform, I was responsible for designing and implementing user interface components using ReactJS. The platform aimed to provide real-time trading functionalities and user-friendly interfaces for cryptocurrency traders.",
            contributions: "Built interactive pages using ReactJS to deliver a seamless and intuitive user experience.\nIntegrated APIs using Axios and implemented Axios interceptors for efficient and secure data handling.\nDeveloped real-time data updates and ensured accurate display of live market information.\nCollaborated with the back-end team to integrate front-end components with server-side functionalities.\nPerformed extensive testing and debugging to ensure optimal application performance and reliability.",
            technologies: "ReactJS, Redux, Axios, Ant Design, Chakra UI, Web Socket, Jotai, Figma, HTML5/CSS3, JavaScript, Node.js, Git, Agile methodologies."
        }
    ],
    education: [
        {
            id: 1,
            degree: 'Bachelor of Engineering (BE)',
            university: 'Gujarat University',
            location: 'Gujarat, India',
            date: ''
        }
    ],
    strengths: "Positive Attitude, Self-Confidence, Quick Learner, Team Work, Energetic, Result Oriented."
};

// --- Default Data for Template 2 (Modern Green) - Himanshu Kanpariya ---
const modernData = {
    name: 'HIMANSHU KANPARIYA',
    designation: 'Senior Front-End Developer',
    phone: '+91 7383057122',
    email: 'himanshup7122@gmail.com',
    linkedin: "",
    github: "",
    location: 'Ahmedabad, Gujarat, India',
    summary: 'I am a highly motivated Senior Front-End Developer with over 8 years of experience in web development, specializing in React.js for more than 4 years. I have a proven track record of building scalable, high-performance web applications and collaborating effectively with cross-functional teams. My passion lies in delivering optimized, accessible, and user-friendly digital solutions that meet user needs.',
    skills: ['HTML', 'CSS', 'Javascript', 'JQuery', 'PHP', 'ReactJs', 'Redux', 'NextJs', 'NodeJs', 'Typescript', 'Material UI', 'Material React Table', 'Express.js', 'API Integration', 'REST api', 'MySQL', 'MongoDB', 'GraphQL', 'Firebase', 'Npm', 'WebSockets', 'Jwt', 'Hooks', 'Jest', 'Integration Testing', 'AWS Lambda', 'Aws Cognito', 'Agile', 'Axios', 'Babel', 'Git', 'BitBucket', 'Bootstrap', 'Ajax', 'Debugging', 'ES6', 'Figma', 'JIRA', 'JSX', 'Wordpress', 'Laravel'],
    experience: [
        {
            id: 1,
            title: 'Senior Front-End Developer',
            company: 'Hornbook Technologies Pvt. Ltd.',
            location: 'Ahmedabad, Gujarat',
            startDate: '01/2021',
            endDate: 'Present',
            companyDescription: 'A company specializing in high-performance web applications.',
            description: `Developed and maintained high-performance React.js and Next.js applications with Redux and TypeScript.
Built responsive and reusable UI components, ensuring cross-browser compatibility and scalability.
Integrated RESTful APIs for real-time banking operations and financial services.
Led performance optimization efforts using lazy loading, image compression, and code splitting.
Wrote unit and integration tests using Jest to ensure application reliability.
Collaborated with backend teams for seamless API implementation and state management.`
        },
        {
            id: 2,
            title: 'Senior Web/Frontend Developer',
            company: 'Vishwa Infoways',
            location: 'Ahmedabad, Gujarat',
            startDate: '07/2016',
            endDate: '01/2021',
            companyDescription: 'A company providing web development services.',
            description: `Developed and maintained custom WordPress websites, themes, and plugins using PHP, JavaScript, and CSS.
Built and optimized e-commerce websites using CodeIgniter and PHP.
Integrated payment gateways (PayPal, Stripe, Authorize.net) into online shopping platforms.
Implemented responsive designs with Bootstrap and Material UI for a mobile-friendly experience.
Set up Google Analytics & Google Tag Manager for tracking and performance analysis.
Collaborated with designers and project managers to deliver high-quality, user-friendly solutions.
Managed source control using Git, GitHub, and Bitbucket.`
        }
    ],
    projects: [
        {
            id: 1,
            title: 'Houseberry Inc.',
            role: 'Front-End Developer',
            teamSize: '',
            description: 'A real estate platform that allows users to explore neighborhoods, homes, schools, and other amenities. The platform integrates Google Maps to display listings based on various scores, helping users find suitable areas or properties. It also includes features for agents to list properties and connect with potential buyers.',
            contributions: `Converted wireframes into a functional React application using Semantic UI.
Designed and developed the web application using HTML5, CSS3, and Semantic UI.
Integrated Google Maps to display listings and neighborhood data visually.
Implemented single-page application (SPA) routing using Next.js.
Developed React components utilizing the latest React hooks for better performance.
Provided enhancements and production support by resolving queries and improving functionality.`,
            technologies: 'React.js, Next.js, Semantic UI, HTML5, CSS3'
        },
        {
            id: 2,
            title: 'Rabo Bank',
            role: 'Front-End Developer',
            teamSize: '',
            description: 'As a front-end developer for a digital banking platform, I was responsible for building and optimizing user interface components using React.js and TypeScript. The platform enabled bank staff to configure and manage financial products, such as loan calculations, interest rates, and discount settings.',
            contributions: `Developed reusable UI components using React.js and TypeScript for banking product configuration.
Integrated secure APIs for real-time loan calculations, interest rate adjustments, and discount management.
Optimized performance by improving rendering efficiency and reducing load times.
Collaborated with UI/UX designers to create user-friendly interfaces.
Ensured compliance with security standards to protect financial data.
Implemented accessibility features for an inclusive user experience.`,
            technologies: 'React.js, TypeScript'
        },
        {
            id: 2,
            title: 'BridgeThings',
            role: 'Front-End Developer',
            teamSize: '',
            description: 'As a front-end developer, I led the development of sensor-based monitoring solutions, building dynamic UIs with React.js, Next.js, and TypeScript. The platform leveraged server-side rendering (SSR) with Next.js for improved performance and SEO, along with real-time data visualization using AmCharts.',
            contributions: `Led front-end development for sensor-based real-time monitoring solutions.
Built dynamic, responsive UIs using React.js, Next.js, Tailwind CSS, and TypeScript.
Implemented server-side rendering (SSR) with Next.js for better SEO and performance.
Integrated secure APIs to fetch real-time sensor data efficiently.
Utilized TypeScript to enhance code reliability, maintainability, and type safety.
Optimized application performance using lazy loading and efficient state management techniques.
Developed custom real-time graphs using AmCharts for data visualization.
Deployed and tested applications via AWS services.`,
            technologies: 'React.js, Next.js, TypeScript, Tailwind CSS, AmCharts, AWS'
        },
        {
            id: 3,
            title: 'BPP Product Catalogue (NatWest Group)',
            role: 'Front-End Developer',
            teamSize: '',
            description: 'As a front-end developer for a digital banking platform, I was responsible for building and optimizing user interface components using React.js and TypeScript. The platform enabled bank employees to configure and manage financial products, such as loan calculations, interest rates, and discount settings.',
            contributions: `Developed reusable UI components using React.js and TypeScript to ensure high performance and fast load times.
Worked closely with the UI/UX design team to develop intuitive, user-friendly interfaces tailored for banking professionals.
Collaborated with the back-end team to integrate front-end functionality with APIs, ensuring a seamless user experience.
Conducted thorough testing and debugging to maintain application stability and resolve issues efficiently.
Ensured compliance with security and privacy regulations, essential for banking applications.
Implemented accessibility features to create an inclusive experience for all bank staff, including those with disabilities.`,
            technologies: 'React.js, TypeScript'
        },
        {
            id: 4,
            title: 'PitchDB',
            role: 'Front-End Developer',
            teamSize: '',
            description: 'As a front-end developer, I designed and developed a responsive UI using React.js, Next.js, and TypeScript, ensuring smooth user interactions for searching and booking services. The platform leveraged server-side rendering (SSR) with Next.js to enhance performance and SEO while improving usability through interactive UI components.',
            contributions: `Designed and developed a responsive UI for seamless user search and booking functionality.
Implemented server-side rendering (SSR) with Next.js and TypeScript for improved load times and SEO optimization.
Translated wireframes into interactive UI components, enhancing user experience and usability.
Optimized UI performance by implementing lazy loading and code splitting techniques.
Integrated API endpoints to fetch real-time service provider data, ensuring dynamic content updates.
Improved accessibility and mobile responsiveness for a better user experience across all devices.
Conducted testing and debugging to enhance platform stability and performance.
Utilized TypeScript to improve code maintainability, type safety, and overall development efficiency.`,
            technologies: 'React.js, Next.js, TypeScript'
        }
    ],
    education: [
        {
            id: 1,
            degree: 'Bachelor of Engineering (B.E.)',
            university: 'Gujarat Technological University',
            location: 'Gujarat',
            date: '08/2012 - 06/2016'
        }
    ],
    strengths: 'Positive Attitude, Self-Confidence, Quick Learner, Team Work, Energetic, Result Oriented.'
};

// --- Default Data for Template 3 (Clean Modern) - Rakesh Patel ---
const rakeshData = {
    name: "RAKESH PATEL",
    designation: "Sr. Frontend Developer",
    phone: "+91-9974004954",
    email: "rakepa84@gmail.com",
    linkedin: "",
    github: "",
    location: "",
    summary: "I am an experienced Front End Developer with 15+ years of expertise, including 5+ years specializing in React.js, Next.js, TypeScript, Material UI, Tailwind CSS and Node.js. I have a strong foundation in web development technologies, such as HTML, CSS, JavaScript, AJAX, PHP, GraphQL and WordPress. I excel in creating responsive, user-friendly websites that enhance user experience and drive business growth. I thrive in cross-functional teams and fast-paced environments.",
    skills: [
        "HTML", "CSS", "Javascript", "J Query", "PHP", "reactjs", "Redux", "Next.js", "node.js", "Typescript",
        "Material UI", "Material React Table", "Express", "REST API", "MySQL", "MongoDB", "GraphQL", "Firebase",
        "npm", "WebSockets", "JWT", "Hooks", "Jest", "Integrating Testing", "AWS Lambda", "AWS Cognito", "Agile",
        "Axious", "Babel", "Git", "Bitbucket", "Boostrap", "Ajax", "Debugging", "Es6", "Figma", "Jira", "JSX",
        "Wordpress", "Laravel"
    ],
    experience: [
        {
            id: 1,
            title: "Senior Front End Developer",
            company: "Hornbook Technologies Pvt. Ltd.",
            startDate: "06/2022",
            endDate: "Present",
            location: "",
            description: `Built and enhanced a freelancing platform, TeamAIWorks, using React, Next.js, Redux and GraphQL to seamlessly connect clients with professionals for AI-driven solutions.
• Developed and managed real-time data-driven interfaces utilizing React, Next.js, and GraphQL for seamless client-professional interactions on TeamAIWorks.
• Utilized Generative AI tools like GitHub Copilot and OpenAI Codex to auto-generate React components, utility functions, and boilerplate code.
• Integrated GraphQL APIs and applied web performance optimization strategies to enhance speed and efficiency on TeamAIWorks, a freelancing platform connecting clients with professionals.
• Implemented frontend optimization techniques including code splitting, lazy loading, and memoization.
• Used AI-assisted development tools to improve productivity while maintaining code quality.
• Ensured high standards for performance, accessibility, and cross-browser compatibility.
• Actively participated in Agile ceremonies and collaborated with remote, distributed teams.
• Collaborated with the backend team to design and integrate RESTful APIs.
• Improved application performance through image optimization, bundle size reduction, and render optimization.`
        },
        {
            id: 2,
            title: "Front-End Developer",
            company: "Simnation",
            startDate: "12/2020",
            endDate: "05/2022",
            location: "",
            companyDescription: "A remote company focused on Internet of Things solutions.",
            description: `• Developed cloud-based solutions with React.js, Next.js, TypeScript, and Node.js.
• Created and maintained real-time data visualization interfaces using customized AmCharts components.
• Integrated RESTful APIs and implemented web performance optimization techniques.
• Built interactive UI modules to efficiently display live sensor and device data.
• Performed regular testing, debugging, and performance tuning to ensure application stability.
• Collaborated remotely with cross-functional teams to deliver features within deadlines.`
        },
        {
            id: 3,
            title: "Front-End Developer",
            company: "Upwork Inc.",
            startDate: "01/2011",
            endDate: "11/2020",
            location: "",
            companyDescription: "A freelancing platform connecting clients with professionals.",
            description: `• Developed a variety of web applications using React.js, Next.js, TypeScript, Redux, Material UI, and Tailwind CSS.
• Implemented responsive design and ensured cross-browser compatibility using Tailwind CSS, Material UI, and CSS frameworks like Bootstrap.
• Collaborated with backend teams to ensure seamless API integrations.
• Delivered multiple client-facing web applications across different domains including business websites, dashboards, and SaaS platforms.
• Integrated third-party APIs and handled asynchronous data flows using Axios and modern JavaScript patterns.
• Optimized application performance by reducing bundle size, improving rendering efficiency, and minimizing re-renders.
• Followed best practices for clean code, folder structure, and component reusability.
• Ensured cross-browser testing and resolved UI inconsistencies across Chrome, Firefox, Safari, and Edge.`
        },
        {
            id: 4,
            title: "Web/Frontend Developer",
            company: "Agile Infoways Pvt. Ltd.",
            startDate: "08/2008",
            endDate: "12/2010",
            location: "",
            companyDescription: "A web development company delivering innovative solutions.",
            description: `• Developed multiple WordPress websites, including custom themes and plugins using PHP, HTML, CSS, and JavaScript.
• Implemented payment gateway integrations and optimized website performance using caching and CDN techniques.
• Collaborated with cross-functional teams to deliver high-quality projects within deadlines.
• Integrated payment gateways and third-party services into web applications.
• Fixed browser compatibility issues and ensured consistent UI behavior across devices.
• Provided post-deployment support, bug fixes, and feature enhancements based on client feedback.`
        }
    ],
    projects: [
        {
            id: 1,
            title: "Houseberry Inc.",
            description: "It is a real estate website where users can explore neighborhoods, homes, schools, etc. Various types of amenities and sections help users view neighborhoods and listings on Google Maps based on scores for specific sections, enabling them to identify suitable areas or listings. Separate features exist for agents to list properties and contact users based on their requirements.",
            contributions: `Responsible for converting Wireframes into React using Semantic UI.
Designed and developed the web application using HTML5, CSS3, Semantic UI.
Implemented various data on the graph using the Google Maps library.
Worked on routing of web pages as a single-page application using Next.js.
Developed React components with the latest React hooks.
Worked on enhancements and production support by resolving queries.`,
            technologies: "React, Next.js, HTML5, CSS3, WebPack, Semantic UI, GitLab, AWS Lambda, AWS S3, AWS Cognito User Pool, AWS AppSync, AWS X-Ray, RDS (MySQL)"
        },
        {
            id: 2,
            title: "BridgeThings",
            description: "It is one kind of admin panel that provides sensor-cloud solutions for monitoring & optimizing energy, water, and other utility resources to help large industrial and commercial buildings become more sustainable.",
            contributions: `Involved in all Agile ceremonies.
Customized AmCharts components, which are the main component, used to display all the dynamic graphs and charts.
Responsible for converting Wireframes into React.
Designed and developed the web application using HTML5, CSS3.
Worked on routing of web pages as a single-page application using React-Routers.
Bug fixing and enhancements.`,
            technologies: "React, HTML5, CSS3, WebPack, AmChart, JIRA"
        },
        {
            id: 3,
            title: "Trust Clarity",
            description: "Developed a multi-store marketplace with Stripe payment solutions and advanced data visualization.",
            contributions: `Designed and developed a scalable platform with React.js
Integrated advanced data visualization tools to provide insights.
Developed custom Redux-based state management for improved performance.
Developed React components with the latest React hooks.
Unit testing.`,
            technologies: "React.js, Redux, Fluree Database"
        }
    ],
    education: [
        {
            id: 1,
            degree: "Master of Computer Applications (MCA)",
            university: "Gujarat University",
            location: "",
            date: ""
        }
    ],
    strengths: "Positive Attitude, Self-Confidence, Quick Learner, Team Work, Energetic, Result Oriented."
};

import { useLayout } from '../context/LayoutContext';

const ResumeBuilder = () => {
    const { setIsOpen } = useLayout();

    // Collapse Sidebar on Component Mount to maximize space
    useEffect(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    // Default form data - initially set to Classic Data
    const [activeTemplate, setActiveTemplate] = useState(1);
    const [formData, setFormData] = useState(classicData);
    const [skillsInput, setSkillsInput] = useState(classicData.skills.join(', '));
    const printRef = useRef();
    const resumeRef = useRef(null);

    // Zoom state for responsive preview
    const [zoom, setZoom] = useState(0.8);
    const [previewSize, setPreviewSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setZoom(0.40);
            else if (window.innerWidth < 1024) setZoom(0.55);
            else if (window.innerWidth < 1280) setZoom(0.65);
            else setZoom(0.8);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Monitor content size for wrapper
    useEffect(() => {
        if (!resumeRef.current) return;

        const calculateSize = () => {
            // Basic A4 min-height buffer check
            const h = resumeRef.current?.offsetHeight || 1132;
            const w = 800;
            setPreviewSize({
                w: w * zoom,
                h: h * zoom
            });
        };

        calculateSize();

        const observer = new ResizeObserver(calculateSize);
        if (resumeRef.current) {
            observer.observe(resumeRef.current);
        }

        return () => observer.disconnect();
    }, [zoom, formData, activeTemplate]);

    // Template Switching Handler
    const handleTemplateChange = (templateId) => {
        setActiveTemplate(templateId);
        if (templateId === 1) {
            setFormData(classicData);
            setSkillsInput(classicData.skills.join(', '));
        } else if (templateId === 2) {
            setFormData(modernData);
            setSkillsInput(modernData.skills.join(', '));
        } else {
            setFormData(rakeshData);
            setSkillsInput(rakeshData.skills.join(', '));
        }
    };

    // Skills handling
    useEffect(() => {
        const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(s => s !== '');
        setFormData(prev => ({ ...prev, skills: skillsArray }));
    }, [skillsInput]);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Resume_${formData.name?.replace(/\s+/g, '_') || 'Document'}`,
        pageStyle: `
            @page {
                size: A4;
                margin: 0mm;
            }
            @media print {
                html, body {
                    height: 100%;
                    width: 210mm;
                    min-width: 210mm;
                }
                body {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    overflow: visible;
                }
            }
        `,
    });

    const handleExperienceChange = (id, field, value) => {
        const updatedExperience = formData.experience.map(exp =>
            exp.id === id ? { ...exp, [field]: value } : exp
        );
        setFormData({ ...formData, experience: updatedExperience });
    };

    const addExperience = () => {
        const newId = formData.experience.length > 0 ? Math.max(...formData.experience.map(e => e.id)) + 1 : 1;
        setFormData({
            ...formData,
            experience: [
                ...formData.experience,
                {
                    id: newId,
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    companyDescription: '',
                    description: '',
                }
            ]
        });
    };

    const removeExperience = (id) => {
        setFormData({
            ...formData,
            experience: formData.experience.filter(exp => exp.id !== id)
        });
    };

    return (

        <div>
            <style type="text/css" media="print">{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-resume, #printable-resume * {
                        visibility: visible;
                    }
                    #printable-resume {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 210mm;
                        height: 297mm;
                        margin: 0;
                        padding: 0;
                        background: white;
                        z-index: 9999;
                    }
                    @page {
                        size: A4;
                        margin: 0;
                    }
                }
            `}</style>
            {/* Page Header - Outside Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] bg-clip-text text-transparent pb-2">
                        Resume Builder
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                        Create professional resumes with a custom theme.
                    </p>
                </div>
            </div>

            {/* Template Selection */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                    Choose Template
                </h3>
                <div className="flex gap-6 overflow-x-auto p-4">
                    {/* Template 1 Thumbnail */}
                    <div
                        onClick={() => handleTemplateChange(1)}
                        className={`cursor-pointer group relative rounded-xl transition-all duration-300 w-44 h-60 shrink-0 flex flex-col p-1
                            ${activeTemplate === 1
                                ? 'ring-2 ring-offset-4 ring-blue-600 scale-100 shadow-2xl bg-white'
                                : 'hover:ring-2 hover:ring-offset-2 hover:ring-blue-300 hover:shadow-lg hover:-translate-y-1 bg-white'}`}
                    >
                        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 relative bg-gray-50 flex flex-col items-center justify-center">
                            <div className="w-full h-full bg-white shadow-sm flex flex-col items-start p-3 gap-2 overflow-hidden pointer-events-none opacity-80 scale-90 origin-top">
                                <div className="w-2/3 h-3 bg-blue-800 rounded-sm mb-2"></div>
                                <div className="w-full h-1.5 bg-gray-300 rounded-sm"></div>
                                <div className="w-full h-1.5 bg-gray-300 rounded-sm"></div>
                                <div className="w-full h-1.5 bg-gray-300 rounded-sm"></div>
                                <div className="w-1/2 h-1.5 bg-gray-300 rounded-sm mt-1"></div>
                                <div className="w-full mt-4 h-[1px] bg-gray-200"></div>
                                <div className="flex gap-2 w-full mt-1">
                                    <div className="w-1/3 h-12 bg-gray-100 rounded-sm"></div>
                                    <div className="w-2/3 space-y-1">
                                        <div className="w-full h-1.5 bg-gray-300 rounded-sm"></div>
                                        <div className="w-full h-1.5 bg-gray-300 rounded-sm"></div>
                                        <div className="w-full h-1.5 bg-gray-300 rounded-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`mt-2 text-center text-sm font-semibold transition-colors ${activeTemplate === 1 ? 'text-blue-700' : 'text-gray-500'}`}>
                            Classic Blue
                        </div>
                        {activeTemplate === 1 && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        )}
                    </div>

                    {/* Template 2 Thumbnail */}
                    <div
                        onClick={() => handleTemplateChange(2)}
                        className={`cursor-pointer group relative rounded-xl transition-all duration-300 w-44 h-60 shrink-0 flex flex-col p-1
                            ${activeTemplate === 2
                                ? 'ring-2 ring-offset-4 ring-green-600 scale-100 shadow-2xl bg-white'
                                : 'hover:ring-2 hover:ring-offset-2 hover:ring-green-300 hover:shadow-lg hover:-translate-y-1 bg-white'}`}
                    >
                        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 relative bg-gray-50 flex flex-col items-center justify-center">
                            <div className="w-full h-full bg-white shadow-sm flex flex-col items-start p-3 gap-2 overflow-hidden pointer-events-none opacity-80 scale-90 origin-top relative">
                                <div className="absolute top-0 right-0 w-12 h-12 bg-green-100 rounded-bl-full z-0"></div>
                                <div className="w-2/3 h-3 bg-green-800 rounded-sm mb-2 z-10"></div>
                                <div className="w-full h-1.5 bg-gray-300 rounded-sm"></div>
                                <div className="w-full h-1.5 bg-gray-300 rounded-sm"></div>
                                <div className="w-1/3 h-1.5 bg-gray-300 rounded-sm mt-1"></div>
                                <div className="w-full mt-4 flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-green-200 shrink-0"></div>
                                    <div className="w-full space-y-1 pt-1">
                                        <div className="w-full h-1.5 bg-gray-300 rounded-sm"></div>
                                        <div className="w-2/3 h-1.5 bg-gray-300 rounded-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`mt-2 text-center text-sm font-semibold transition-colors ${activeTemplate === 2 ? 'text-green-700' : 'text-gray-500'}`}>
                            Modern Green
                        </div>
                        {activeTemplate === 2 && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white shadow-md z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        )}
                    </div>

                    {/* Template 3 Thumbnail - Clean Modern */}
                    <div
                        onClick={() => handleTemplateChange(3)}
                        className={`cursor-pointer group relative rounded-xl transition-all duration-300 w-44 h-60 shrink-0 flex flex-col p-1
                            ${activeTemplate === 3
                                ? 'ring-2 ring-offset-4 ring-slate-800 scale-100 shadow-2xl bg-white'
                                : 'hover:ring-2 hover:ring-offset-2 hover:ring-slate-400 hover:shadow-lg hover:-translate-y-1 bg-white'}`}
                    >
                        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 relative bg-gray-50 flex flex-col items-center justify-center">
                            <div className="w-full h-full bg-white shadow-sm flex flex-col items-start p-3 gap-2 overflow-hidden pointer-events-none opacity-80 scale-90 origin-top relative">
                                {/* Simple Text Header */}
                                <div className="w-3/4 h-3 bg-slate-800 rounded-sm mb-1 z-10"></div>
                                <div className="w-1/2 h-2 bg-blue-500 rounded-sm mb-3"></div>
                                <div className="w-full h-0.5 bg-slate-200 mb-2"></div>
                                {/* Content Lines */}
                                <div className="w-full h-1 bg-gray-300 rounded-sm"></div>
                                <div className="w-full h-1 bg-gray-300 rounded-sm"></div>
                                <div className="w-full h-1 bg-gray-300 rounded-sm"></div>
                                <div className="w-full mt-3 h-0.5 bg-slate-800"></div>
                                <div className="w-full mt-1 flex gap-2 flex-wrap">
                                    <div className="w-8 h-1 bg-gray-200 rounded-sm"></div>
                                    <div className="w-8 h-1 bg-gray-200 rounded-sm"></div>
                                    <div className="w-8 h-1 bg-gray-200 rounded-sm"></div>
                                </div>
                            </div>
                        </div>
                        <div className={`mt-2 text-center text-sm font-semibold transition-colors ${activeTemplate === 3 ? 'text-slate-800' : 'text-gray-500'}`}>
                            Clean Modern
                        </div>
                        {activeTemplate === 3 && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-md z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        )}
                    </div>

                    {/* Template 4 Thumbnail - Luxe Crystal */}
                    <div
                        onClick={() => handleTemplateChange(4)}
                        className={`cursor-pointer group relative rounded-xl transition-all duration-300 w-44 h-60 shrink-0 flex flex-col p-1
                            ${activeTemplate === 4
                                ? 'ring-2 ring-offset-4 ring-blue-600 scale-100 shadow-2xl bg-white'
                                : 'hover:ring-2 hover:ring-offset-2 hover:ring-blue-400 hover:shadow-lg hover:-translate-y-1 bg-white'}`}
                    >
                        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 relative bg-slate-100 flex flex-col p-2 gap-2">
                            {/* Bold Top Block */}
                            <div className="absolute top-0 left-0 w-full h-12 bg-blue-600"></div>

                            {/* Glass Header Card Thumb */}
                            <div className="w-full bg-white/70 border border-white p-2 rounded-lg shadow-sm backdrop-blur-[2px] relative z-10 mt-2">
                                <div className="w-1/3 h-1.5 bg-slate-900 rounded-sm mb-1"></div>
                                <div className="w-1/4 h-1 bg-blue-500 rounded-sm"></div>
                            </div>

                            {/* Content Card Thumbs (Stacked Rows) */}
                            <div className="w-full bg-white border border-slate-200 p-2 rounded shadow-sm space-y-1 relative z-10">
                                <div className="w-1/4 h-1 bg-slate-200 rounded-full"></div>
                                <div className="w-full h-0.5 bg-slate-50 rounded-full"></div>
                                <div className="w-full h-0.5 bg-slate-50 rounded-full"></div>
                            </div>
                            <div className="w-full bg-white border border-slate-200 p-2 rounded shadow-sm space-y-1 relative z-10">
                                <div className="w-1/4 h-1 bg-slate-200 rounded-full"></div>
                                <div className="w-full h-0.5 bg-slate-50 rounded-full"></div>
                            </div>
                            <div className="w-full flex-1 bg-white border border-slate-200 p-2 rounded shadow-sm space-y-1 relative z-10">
                                <div className="w-1/4 h-1 bg-slate-200 rounded-full"></div>
                                <div className="w-full h-0.5 bg-slate-50 rounded-full"></div>
                            </div>

                            {activeTemplate === 4 && (
                                <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md z-20">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            )}
                        </div>
                        <div className={`mt-2 text-center text-sm font-semibold transition-colors ${activeTemplate === 4 ? 'text-blue-700' : 'text-gray-500'}`}>
                            Luxe Crystal
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Editor Section */}
                    <div className="space-y-6">

                        <Card
                            className="p-6 border border-white/60 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/60 ring-1 ring-black/5"
                            style={{
                                boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)"
                            }}
                        >
                            <div className="space-y-6 h-[650px] xl:h-[950px] overflow-y-auto pr-2">
                                {/* Personal Details */}
                                <div className="space-y-4">
                                    <h3 className='font-bold text-lg text-gray-800 border-b pb-2'>Personal Details</h3>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div className='grid gap-2'>
                                            <Label htmlFor='name'>Full Name</Label>
                                            <Input
                                                id='name'
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className='grid gap-2'>
                                            <Label htmlFor='designation'>Current Designation (Title)</Label>
                                            <Textarea
                                                id='designation'
                                                value={formData.designation}
                                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                                className="text-sm min-h-[38px] py-2"
                                                rows={1}
                                                placeholder='e.g. Senior Product Designer'
                                            />
                                        </div>
                                        <div className='grid gap-2'>
                                            <Label htmlFor='phone'>Phone</Label>
                                            <Input
                                                id='phone'
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className='grid gap-2'>
                                            <Label htmlFor='email'>Email</Label>
                                            <Input
                                                id='email'
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className='grid gap-2'>
                                            <Label htmlFor='linkedin'>LinkedIn Profile</Label>
                                            <Input
                                                id='linkedin'
                                                value={formData.linkedin || ''}
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                        </div>
                                        <div className='grid gap-2'>
                                            <Label htmlFor='github'>GitHub Profile</Label>
                                            <Input
                                                id='github'
                                                value={formData.github || ''}
                                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                                placeholder="https://github.com/username"
                                            />
                                        </div>
                                        <div className='grid gap-2 md:col-span-2'>
                                            <Label htmlFor='location'>Location</Label>
                                            <Textarea
                                                id='location'
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="text-sm min-h-[38px] py-2"
                                                rows={1}
                                                placeholder='e.g. San Francisco, CA'
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="space-y-4">
                                    <h3 className='font-bold text-lg text-gray-800 border-b pb-2'>Profile Summary</h3>
                                    <div className='grid gap-2'>
                                        <Label htmlFor='summary'>Professional Summary</Label>
                                        <Textarea
                                            id='summary'
                                            rows={4}
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            placeholder="Write a brief summary of your professional background..."
                                        />
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="space-y-4">
                                    <h3 className='font-bold text-lg text-gray-800 border-b pb-2'>Skills</h3>
                                    <div className='grid gap-2'>
                                        <Label htmlFor='skills'>Skills (comma separated)</Label>
                                        <Textarea
                                            id='skills'
                                            rows={2}
                                            value={skillsInput}
                                            onChange={(e) => setSkillsInput(e.target.value)}
                                            placeholder="e.g. React.js, Node.js, Project Management, Team Leadership"
                                        />
                                        <p className="text-xs text-muted-foreground">{formData.skills.length} skills added</p>
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <h3 className='font-bold text-lg text-gray-800'>Work Experience</h3>
                                        <Button size="sm" variant="outline" onClick={addExperience} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                            <Plus className="w-4 h-4 mr-1" /> Add
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {formData.experience.map((exp, index) => (
                                            <div key={exp.id} className="p-4 border rounded-md bg-gray-50 relative group">

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => removeExperience(exp.id)}
                                                    className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <h4 className="text-sm font-semibold text-gray-500 mb-3">Experience #{index + 1}</h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                    <div>
                                                        <Label className="text-xs">Job Title</Label>
                                                        <Textarea
                                                            value={exp.title}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                                                            className="text-sm min-h-[38px] py-2"
                                                            rows={1}
                                                            placeholder="e.g. Senior Developer"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Company Name</Label>
                                                        <Textarea
                                                            value={exp.company}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                                            className="text-sm min-h-[38px] py-1"
                                                            rows={1}
                                                            placeholder="e.g. Tech Corp"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Label className="text-xs">Company Short Description</Label>
                                                        <Textarea
                                                            value={exp.companyDescription}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'companyDescription', e.target.value)}
                                                            className="text-sm min-h-[38px] py-2 italic text-gray-600 bg-gray-50"
                                                            rows={1}
                                                            placeholder="e.g. A company specializing in web application development."
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Start Date</Label>
                                                        <Input
                                                            value={exp.startDate}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                                                            className="h-8 text-sm"
                                                            placeholder="e.g. Jun 2020"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">End Date</Label>
                                                        <Input
                                                            value={exp.endDate}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                                                            className="h-8 text-sm"
                                                            placeholder="e.g. Present"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Label className="text-xs">Location</Label>
                                                        <Textarea
                                                            value={exp.location}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                                                            className="text-sm min-h-[38px] py-2"
                                                            rows={1}
                                                            placeholder="e.g. Remote / New York"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Description</Label>
                                                    <Textarea
                                                        rows={3}
                                                        value={exp.description}
                                                        onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                                                        className="text-sm"
                                                        placeholder="Describe your roles and responsibilities..."
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Projects */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <h3 className='font-bold text-lg text-gray-800'>Projects</h3>
                                        <Button size="sm" variant="outline" onClick={() => {
                                            const newId = formData.projects.length > 0 ? Math.max(...formData.projects.map(p => p.id)) + 1 : 1;
                                            setFormData(prev => ({
                                                ...prev,
                                                projects: [...prev.projects, { id: newId, title: '', role: '', teamSize: '', description: '', contributions: '', technologies: '' }]
                                            }));
                                        }} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                            <Plus className="w-4 h-4 mr-1" /> Add
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {formData.projects.map((proj, index) => (
                                            <div key={proj.id} className="p-4 border rounded-md bg-gray-50 relative group">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => setFormData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== proj.id) }))}
                                                    className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <h4 className="text-sm font-semibold text-gray-500 mb-3">Project #{index + 1}</h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                    <div className="md:col-span-2">
                                                        <Label className="text-xs">Project Title</Label>
                                                        <Textarea
                                                            value={proj.title}
                                                            onChange={(e) => {
                                                                const updated = formData.projects.map(p => p.id === proj.id ? { ...p, title: e.target.value } : p);
                                                                setFormData({ ...formData, projects: updated });
                                                            }}
                                                            className="text-sm min-h-[38px] py-2"
                                                            rows={1}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Role</Label>
                                                        <Textarea
                                                            value={proj.role}
                                                            onChange={(e) => {
                                                                const updated = formData.projects.map(p => p.id === proj.id ? { ...p, role: e.target.value } : p);
                                                                setFormData({ ...formData, projects: updated });
                                                            }}
                                                            className="text-sm min-h-[38px] py-2"
                                                            rows={1}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Team Size</Label>
                                                        <Textarea
                                                            value={proj.teamSize}
                                                            onChange={(e) => {
                                                                const updated = formData.projects.map(p => p.id === proj.id ? { ...p, teamSize: e.target.value } : p);
                                                                setFormData({ ...formData, projects: updated });
                                                            }}
                                                            className="text-sm min-h-[38px] py-2"
                                                            rows={1}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Label className="text-xs">Description</Label>
                                                        <Textarea
                                                            rows={2}
                                                            value={proj.description}
                                                            onChange={(e) => {
                                                                const updated = formData.projects.map(p => p.id === proj.id ? { ...p, description: e.target.value } : p);
                                                                setFormData({ ...formData, projects: updated });
                                                            }}
                                                            className="text-sm"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Label className="text-xs">Key Contributions (Bullet points)</Label>
                                                        <Textarea
                                                            rows={3}
                                                            value={proj.contributions}
                                                            onChange={(e) => {
                                                                const updated = formData.projects.map(p => p.id === proj.id ? { ...p, contributions: e.target.value } : p);
                                                                setFormData({ ...formData, projects: updated });
                                                            }}
                                                            className="text-sm"
                                                            placeholder="Enter each contribution on a new line"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Label className="text-xs">Technologies Used</Label>
                                                        <Textarea
                                                            value={proj.technologies}
                                                            onChange={(e) => {
                                                                const updated = formData.projects.map(p => p.id === proj.id ? { ...p, technologies: e.target.value } : p);
                                                                setFormData({ ...formData, projects: updated });
                                                            }}
                                                            className="text-sm min-h-[38px] py-2"
                                                            rows={2}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <h3 className='font-bold text-lg text-gray-800'>Education</h3>
                                        <Button size="sm" variant="outline" onClick={() => {
                                            const newId = formData.education.length > 0 ? Math.max(...formData.education.map(e => e.id)) + 1 : 1;
                                            setFormData(prev => ({
                                                ...prev,
                                                education: [...prev.education, { id: newId, degree: '', university: '', location: '', date: '' }]
                                            }));
                                        }} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                            <Plus className="w-4 h-4 mr-1" /> Add
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {formData.education.map((edu, index) => (
                                            <div key={edu.id} className="p-4 border rounded-md bg-gray-50 relative group">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => setFormData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) }))}
                                                    className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <Label className="text-xs">Degree/Course</Label>
                                                        <Input
                                                            value={edu.degree}
                                                            onChange={(e) => {
                                                                const updated = formData.education.map(ed => ed.id === edu.id ? { ...ed, degree: e.target.value } : ed);
                                                                setFormData({ ...formData, education: updated });
                                                            }}
                                                            className="h-8 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">University/Institute</Label>
                                                        <Input
                                                            value={edu.university}
                                                            onChange={(e) => {
                                                                const updated = formData.education.map(ed => ed.id === edu.id ? { ...ed, university: e.target.value } : ed);
                                                                setFormData({ ...formData, education: updated });
                                                            }}
                                                            className="h-8 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Location</Label>
                                                        <Input
                                                            value={edu.location}
                                                            onChange={(e) => {
                                                                const updated = formData.education.map(ed => ed.id === edu.id ? { ...ed, location: e.target.value } : ed);
                                                                setFormData({ ...formData, education: updated });
                                                            }}
                                                            className="h-8 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Year/Date (Optional)</Label>
                                                        <Input
                                                            value={edu.date}
                                                            onChange={(e) => {
                                                                const updated = formData.education.map(ed => ed.id === edu.id ? { ...ed, date: e.target.value } : ed);
                                                                setFormData({ ...formData, education: updated });
                                                            }}
                                                            className="h-8 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Strengths */}
                                <div className="space-y-4">
                                    <h3 className='font-bold text-lg text-gray-800 border-b pb-2'>Strengths</h3>
                                    <div className='grid gap-2'>
                                        <Label htmlFor='strengths'>Major Strengths (comma separated)</Label>
                                        <Textarea
                                            id='strengths'
                                            rows={3}
                                            value={formData.strengths}
                                            onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                                            placeholder="Positive Attitude, Team Work, etc."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='pt-6 border-t mt-4'>
                                <Button
                                    className='w-full bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white shadow-lg font-semibold h-12'
                                    onClick={handlePrint}
                                >
                                    <Printer className='mr-2 h-5 w-5' /> Print / Save as PDF
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Live Preview */}
                    <div className="mt-8 lg:mt-0">
                        <div className='lg:sticky lg:top-8'>
                            <div className='w-full text-center mb-2 font-semibold text-gray-500'>Live Preview</div>
                            <div className='border shadow-sm rounded-lg bg-gray-100/80 backdrop-blur-sm p-4 w-full h-[650px] xl:h-[950px] overflow-auto flex justify-center'>
                                <div style={{ width: previewSize.w, height: previewSize.h, position: 'relative' }} className="shrink-0 transition-all duration-300 ease-out">
                                    <div
                                        ref={resumeRef}
                                        style={{
                                            transform: `scale(${zoom})`,
                                            width: '800px',
                                            minHeight: '1132px',
                                            transformOrigin: 'top left'
                                        }}
                                        className='bg-white shadow-2xl absolute top-0 left-0'
                                    >
                                        <div className='pointer-events-none select-none'>
                                            {activeTemplate === 1 ? (
                                                <ResumeTemplate data={formData} />
                                            ) : activeTemplate === 2 ? (
                                                <ResumeTemplateTwo data={formData} />
                                            ) : activeTemplate === 3 ? (
                                                <ResumeTemplateThree data={formData} />
                                            ) : (
                                                <ResumeTemplateFour data={formData} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Printable Component */}
            <div style={{ position: 'absolute', left: '-10000px', top: 0 }}>
                <div ref={printRef} id="printable-resume">
                    {activeTemplate === 1 ? (
                        <ResumeTemplate data={formData} />
                    ) : activeTemplate === 2 ? (
                        <ResumeTemplateTwo data={formData} />
                    ) : activeTemplate === 3 ? (
                        <ResumeTemplateThree data={formData} />
                    ) : (
                        <ResumeTemplateFour data={formData} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
