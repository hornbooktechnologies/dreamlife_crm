import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Trash2, Plus, GripVertical, Printer, Upload, FileText, Loader2, Download, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import ResumeTemplate from '../components/documents/ResumeTemplate';
import ResumeTemplateTwo from '../components/documents/ResumeTemplateTwo';
import ResumeTemplateThree from '../components/documents/ResumeTemplateThree';
import ResumeTemplateFour from '../components/documents/ResumeTemplateFour';
import ResumeTemplateFive from '../components/documents/ResumeTemplateFive';
import ResumeTemplateSix from '../components/documents/ResumeTemplateSix';
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
    strengths: "Positive Attitude, Self-Confidence, Quick Learner, Team Work, Energetic, Result Oriented.",
    themeColor: "#002b7f",
    secondaryColor: "#f96b07",
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
            id: 5,
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
    strengths: 'Positive Attitude, Self-Confidence, Quick Learner, Team Work, Energetic, Result Oriented.',
    themeColor: '#124f44',
    secondaryColor: '#3cb371'
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
    themeColor: "#3b82f6",
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
            companyDescription: "Built and enhanced a freelancing platform, TeamAIWorks, using React, Next.js, Redux and GraphQL to seamlessly connect clients with professionals for AI-driven solutions.",
            description: `• Developed and managed real-time data-driven interfaces utilizing React, Next.js, and GraphQL for seamless client-professional interactions on TeamAIWorks.
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

// --- Default Data for Template 4 (Luxe Crystal) - Sunny Rajput ---
const sunnyData = {
    name: "Sunny Rajput",
    designation: "Front End Developer",
    phone: "+91 7862038607",
    email: "sunnyrajputt9987@gmail.com",
    linkedin: "www.linkedin.com/in/sunny-rajput",
    github: "github.com/sunny-rajput",
    location: "Ahmedabad, Gujarat, India",
    themeColor: "#0891b2",
    summary: "I am a Frontend Developer with over 3 years of experience in designing, developing, and maintaining scalable web applications. I specialize in creating responsive, accessible, and performance-optimized user interfaces, with a strong focus on React.js, Redux, Next.js, and modern JavaScript technologies. I thrive in collaborative Agile environments and am committed to delivering high-quality, user-centric applications.",
    skills: [
        "HTML", "CSS", "JavaScript", "JQuery", "Reactjs", "Redux", "Nextjs", "Nodejs", "TypeScript", "Material UI",
        "Material React Table", "Express", "API Integration", "REST API", "MySQL", "MongoDB", "GraphQL", "Firebase",
        "Npm", "WebSockets", "JWT", "Hooks", "Jest", "Integration Testing", "AWS Lambda", "Aws Cognito", "Agile",
        "Axios", "Babel", "Git", "BitBucket", "bootstrap", "Ajax", "Debugging", "ES6", "Figma", "Jira"
    ],
    experience: [
        {
            id: 1,
            title: "Front End Developer",
            company: "Hornbook Technologies PVT LTD.",
            location: "Ahmedabad, Gujarat",
            startDate: "06/2022",
            endDate: "Present",
            companyDescription: "As a Frontend Developer at Hornbook Technologies PVT LTD, I am responsible for developing scalable, responsive, and user-friendly web applications using React.js, Material UI, and modern JavaScript. I focus on building intuitive, high-performance user interfaces and ensuring seamless integration with backend services.",
            description: `• Design and develop scalable, responsive user interfaces using React.js, Material UI, and React Router, ensuring a seamless user experience across devices.
• Translate Figma wireframes into reusable and modular React components, with a strong emphasis on accessibility and performance optimization.
• Implement JWT-based authentication and handle session management to ensure secure user login and access control across the platform.
• Conduct thorough testing using Jest and React Testing Library to ensure cross-browser compatibility and mobile responsiveness.
• Utilize Git and Bitbucket for version control, collaborating effectively within Agile Scrum teams using Jira to track progress and tasks.
• Actively participate in code reviews and contribute to architecture-level decisions aimed at improving the scalability, performance, and maintainability of applications.`
        }
    ],
    projects: [
        {
            id: 1,
            title: "Nurse.io - Healthcare Staffing Platform",
            role: "",
            teamSize: "",
            description: "As a Frontend Developer on the Nurse.io healthcare staffing platform, I am responsible for developing and maintaining the frontend systems that support real-time nurse shift booking, schedule management, and healthcare facility dashboards.",
            technologies: "JavaScript, React.js, Redux Toolkit, HTML5/CSS3/SASS, GitLab",
            contributions: `• Work as a Frontend Developer using JavaScript, React.js, Redux Toolkit, HTML5/CSS3/SASS, and GitLab.\n• Implement Redux Toolkit and asynchronous logic to handle API state management across shift calendars and booking workflows.\n• Build scalable UI components using React with ES6 and JSX for dynamic dashboards, request forms, and live shift feeds.\n• Optimize performance through code splitting, lazy loading, and modular design patterns.\n• Create unit tests using Jest and React Testing Library to ensure UI consistency and functionality.\n• Use Axios to handle secure and authenticated API calls for booking workflows and nurse verifications.\n• Implement routing and protected access using React Router, including custom guards and role-based views.\n• Collaborate within an Agile/Scrum environment using Jira and Confluence to manage sprints, track tasks, and document workflows.\n• Ensure data security and compliance with healthcare industry standards, including access controls and encrypted data flows.`
        },
        {
            id: 2,
            title: "Core Banking Product for Bank Staff",
            role: "",
            teamSize: "",
            description: "As a Frontend Developer on the Core Banking Product for Bank Staff, I was responsible for developing and implementing user interface components using ReactJS. The product was designed to enable bank staff to build customized products with calculations for loan amounts, interest rates, and discounts.",
            technologies: "JavaScript, ES6, React, Redux, RESTful services, HTML5/CSS3/SASS/Bootstrap, GitLab",
            contributions: `• Worked as a Frontend Developer on this project using JavaScript, ES6, React, Redux, RESTful services, HTML5/CSS3/SASS/Bootstrap, and GitLab.\n• Implemented Redux for state management and handling synchronous API calls.\n• Created unit tests using the Jest library to ensure functionality and UI consistency.\n• Used ES6, JSX, and React to develop elegant, reusable components.\n• Used React Router and Axios to manage routing and retrieve data from the server synchronously in the background without interfering with the existing page.\n• Participated in an Agile/SCRUM development process, using JIRA and Confluence for task tracking and documentation.`
        }
    ],
    education: [
        {
            id: 1,
            degree: "Bachelor of Engineering (I.T)",
            university: "Hasmukh Goswami College of Engineering",
            location: "",
            date: ""
        }
    ],
    strengths: "Core Strength: Positive attitude, Self confidence, Quick learner, Team work and solution-oriented mindset."
};

// --- Default Data for Template 5 (Black & White) - Default Copy ---
const blackData = {
    ...classicData,
    name: "Raxit Vaghela",
    email: "Raxitv27@gmail.com",
    phone: "+91-9664522956",
    linkedin: "www.linkedin.com/in/raxit-vaghela",
    github: "github.com/raxitvaghela",
    location: "Ahmedabad, Gujarat, India",
    themeColor: "#111827",
    sectionOrder: ['personal', 'summary', 'skills', 'experience', 'projects', 'education', 'strengths'],
    summary: `<b>Over 10+ years of professional experience in software development as a Web/UI/Front End developer in various client domains.</b>
From last <b>5 years</b> Working in ReactJS, NextJS & NodeJS to build small to large scale of web application.
Experience in developing software applications using <b>PHP & MySQL</b> technologies and involved in all phases of Software Development Life Cycle (SDLC).
Expertise in Client Scripting language and server-side scripting languages like <b>HTML5, CSS3, JavaScript with ECMA6 features, TypeScript, jQuery, JSON, Bootstrap, React JS, Redux, MFE, Jest</b>
Implemented Services and Dependency Injection in ReactJS to connect the web application to back-end APIs and for sharing the code between the components
Proficiency on Responsive Web Design using Custom CSS, Bootstrap, cross browser and adapt to the changing environment`,

    // Technical Skills
    techWeb: "ReactJS, HTML5, CSS3, JavaScript, AJAX, JSON, DOM, Bootstrap, JQuery, TypeScript, REST, Redux, NodeJS",
    techDatabase: "MySQL, RDS",
    techIDE: "Dreamweaver, MS Visual Studio Code, Sublime",
    techTools: "GitHub, BitBucket, Gitlab",
    techOther: "Azure DevOps, Jera, Microsoft Teams, Slack",
    resumeSixSkills: [
        { id: 1, label: "Web Technologies", value: "ReactJS, HTML5, CSS3, JavaScript, AJAX, JSON, DOM, Bootstrap, JQuery, TypeScript, REST, Redux, NodeJS" },
        { id: 2, label: "Database", value: "MySQL, RDS" },
        { id: 3, label: "IDE", value: "Dreamweaver, MS Visual Studio Code, Sublime" },
        { id: 4, label: "Code Management Tools", value: "GitHub, BitBucket, Gitlab" },
        { id: 5, label: "Other Tools", value: "Azure DevOps, Jera, Microsoft Teams, Slack" }
    ],

    // Functional Skills
    strengths: `Interaction with business analysts and external stakeholders for business requirement gathering, conducting system analysis and finalizing technical/functional specifications.
Sprint planning for delivering functionalweb versions.
Define best practices for project development, Designing, developing, testing, troubleshooting applications and guiding teams to adhere best practices.
Cooperating & communicating with development and QA teams for efficient work management to deliver work sprints successfully.
Deliver best work onetime`,

    experience: [
        {
            id: 1,
            title: "Senior front-end developer",
            company: "Hornbook Technologies PVT. LTD.",
            location: "Ahmedabad, Gujarat",
            startDate: "06/2022",
            endDate: "Present",
            companyDescription: "",
            description: `Daily Internal Meeting with Technical Manager & Scrum Master gathering requirements and understanding business needs for developing the application
Daily Standup Calls with Clients
Sprint Grooming and tasks division
Handling Complete Front-End Development throughout the Project.
Developing, testing and delivering the items with no defect on time.
Involved into help & support to Project Teammates.`
        },
        {
            id: 2,
            title: "Senior front-end developer",
            company: "Lumos Fineserv",
            location: "",
            startDate: "",
            endDate: "",
            companyDescription: "",
            description: `Daily Internal Meeting with Technical Manager & Scrum Master gathering requirements and understanding business needs for developing the application
Daily Standup Calls with Clients
Sprint Grooming and tasks division
Handling Complete Front-End Development throughout the Project.
Developing, testing and delivering the items with no defect on time.
Involved into help & support to Project Teammates.`
        },
        {
            id: 3,
            title: "Senior front-end developer",
            company: "Truelancer",
            location: "",
            startDate: "",
            endDate: "",
            companyDescription: "",
            description: `Daily Internal Meeting with Technical Manager & Scrum Master gathering requirements and understanding business needs for developing the application
Daily Standup Calls with Clients
Sprint Grooming and tasks division
Handling Complete Front-End Development throughout the Project.
Developing, testing and delivering the items with no defect on time.
Involved into help & support to Project Teammates.`
        },
        {
            id: 4,
            title: "Sr. Web/Frontend Developer",
            company: "Vishwa Infoways",
            location: "Ahmedabad, Gujarat",
            startDate: "11/2011",
            endDate: "03/2020",
            companyDescription: "",
            description: `Participated in <b>daily internal meetings</b> with the Technical Manager & Scrum Master to gather requirements and align development with business objectives.
Conducted <b>daily standup calls with clients</b> to provide updates and clarify technical needs.Sprint Grooming and tasks division
Engaged in <b>sprint grooming sessions</b> and contributed to effective task planning and distribution
Took ownership of the <b>entire front-end development lifecycle</b> across multiple project phases.
Delivered <b>high-quality, tested features</b> within deadlines, ensuring zero critical defects.
Actively provided <b>support and guidance to project teammates</b>, fostering collaboration and knowledge sharing.`
        }
    ],

    projects: [
        {
            id: 1,
            title: "Pitchdb",
            description: "PitchDB is a search tool and provide a better way to manage your booking process.",
            contributions: `Created using ReactJS as frontend and Node as a backend technology.
My role was to lead the front-end UI development with API integration.
Worked with multiple user roles to handle different functionalities.
Unit testing.
Responsible to create Responsive Web Design using Twitter Bootstrap and Media Queries.
Design & Development of Templates, Components, different renditions, services etc.
Setting Page Properties - Ext JS Configuration and Custom widgets creation
Handled the status of the project in a timely manner in a clear and concise way.
Handled all aspects of the web application including maintaining, testing, debugging, deploying.`,
            technologies: "React JS, NodeJS as backend"
        },
        {
            id: 2,
            title: "Trust Clarity",
            description: "Provides sensor-cloud solutions for monitoring & optimizing energy, water and other utility resources to help large industrial and commercial buildings become more sustainable",
            contributions: `Created using ReactJs as frontend and JAVA as a backend technology.
Team of 2 frontend developers and 2 backend developers. My role was to lead the front end UI development with API integration.
Responsible to create Responsive Web Design using MaterialUI.
Design & Development of Templates, Components, different renditions, services etc.
Setting Page Properties - Ext JS Configuration and Custom widgets creation
Handled the status of the project in a timely manner in a clear and concise way.
Handled all aspects of the web application including maintaining, testing, debugging, deploying.
Customized Amcharts component which is the main component used to show all the dynamic graphs and charts.`,
            technologies: "React JS, Node as backend"
        },
        {
            id: 3,
            title: "Scopify",
            description: "Help to find hot leads with Budget, Authority, Need and Timeline (BANT Intel™) in any company and get qualified meetings with the exact decision makers.",
            contributions: "",
            technologies: ""
        },
        {
            id: 4,
            title: "KP Factors",
            description: "KP Factors (– Key Performance Factors)- helps to disrupt SaaS space by hosting and developing a marketplace of SaaS apps where subscribers can pick and choose applications on the same physical platform",
            contributions: "",
            technologies: ""
        }
    ],

    education: [
        {
            id: 1,
            degree: 'Bachelor of engineering in information & technology',
            university: '', // User did not specify
            location: '',   // User did not specify
            date: ''        // User did not specify
        }
    ]
};

// --- Default Data for Template 6 (Pro Red) - Raxit Vaghela ---
const proRedData = {
    name: "Raxit Vaghela",
    designation: "SR. REACTJS DEVELOPER",
    themeColor: "#1a4594",
    secondaryColor: "#ef4444",
    experience_years: "4+",
    coreCompetencies: [
        "Skilled in developing clean, modular, and maintainable UI components using React's component-based architecture to support scalability and code reuse.",
        "Strong command of managing both local and global state efficiently using React Hooks, Redux, and Context API, ensuring responsive and consistent application behavior.",
        "Proficient in building mobile-first, pixel-perfect interfaces using HTML5, CSS3, and Material UI, while adhering to accessibility best practices (WCAG standards).",
        "Experienced in integrating RESTful APIs and GraphQL, managing asynchronous operations with tools like Axios and React Query, and implementing robust error handling strategies.",
        "Knowledgeable in performance tuning techniques including lazy loading, code splitting, memoization, and image optimization to deliver fast, smooth user experiences.",
        "Familiar with writing unit and integration tests using tools like Jest and Enzyme, and adept at identifying and resolving issues throughout the development lifecycle.",
        "Proficient in using Git and platforms like GitHub or Bitbucket for source control; experienced in working in Agile teams using tools such as JIRA for sprint and task management.",
        "Experienced with front-end tooling such as Webpack, Babel, npm/yarn, and capable of configuring optimized build processes for development and production environments."
    ],
    resumeSixProjectManagement: "Zoho, Slack, MS Teams, JIRA, Trello",
    resumeSixSkills: [
        { id: 1, label: 'Languages', value: 'JavaScript (ES6+), TypeScript, HTML5, CSS3, PHP' },
        { id: 2, label: 'Framework & APIs', value: 'ReactJS, NextJS, Redux, Express.js, NodeJS, RESTful APIs, GraphQL, JSX, Ajax' },
        { id: 3, label: 'State Management', value: 'Redux, React Context API, React Hooks, Jotai, React Query' },
        { id: 4, label: 'Data Visualization & SDKs', value: 'ChartJS, Ant Design Chart, Carbon Planner SDKs, Google Maps API, WebSocket SDK, Amcharts' },
        { id: 5, label: 'API Integrations', value: 'Axios, React Query, REST APIs, GraphQL, Firebase, JWT Authentication, Stripe' },
        { id: 6, label: 'Database', value: 'MySQL, MongoDB' },
        { id: 7, label: 'Cloud Services', value: 'AWS Lambda, AWS Cognito' },
        { id: 8, label: 'Software Build & Tools', value: 'Babel, Webpack, NPM, Yarn, ESLint, Prettier' },
        { id: 9, label: '3rd Party services', value: 'Storybook, Auth0, MaterialUI, Styled Components, Stripe, PayPal, Authorize.net (via eCommerce integrations), Google Maps, Figma, Sketch' },
        { id: 10, label: 'Development Tools', value: 'VS Code, Postman, MongoDB Compass' },
        { id: 11, label: 'Testing', value: 'Jest, React Testing Library' },
        { id: 12, label: 'CI/CD Tools', value: 'Circle CI' },
        { id: 13, label: 'Version Control', value: 'Git, Bitbucket, GitHub' },
        { id: 14, label: 'Project management', value: 'Zoho, Slack, MS Teams, JIRA, Trello' }
    ],
    skills: ["ReactJS", "NextJS", "Redux", "NodeJS", "TypeScript", "GraphQL", "AWS", "Jira"],
    experience: [
        {
            id: 1,
            title: 'SR. REACTJS DEVELOPER',
            company: 'HORNBOOK TECHNOLOGIES',
            location: 'Ahmedabad, Gujarat',
            startDate: 'Jan 2020',
            endDate: 'Present',
            description: 'Leading the front-end development of high-performance web applications using ReactJS and modern tech stack.\nCollaborating with cross-functional teams to deliver scalable and maintainable UI solutions.\nOptimizing application performance and ensuring best practices in code quality and accessibility.'
        }
    ],
    projects: [
        {
            id: 1,
            title: 'BANKING APPLICATION',
            description: 'A core banking web application designed specifically for internal bank staff. The goal was to enable employees to configure and manage financial products such as loans, interest schemes, and discount rules—streamlining what were previously manual, back-office tasks.',
            roles: 'Led the development of scalable, modular UI components using ReactJS, ensuring responsive behavior across various screen sizes.\nCollaborated closely with UI/UX designers to translate high-fidelity mockups into pixel-perfect, accessible web interfaces.\nIntegrated RESTful APIs provided by the backend team to enable dynamic content and secure data operations.\nConducted unit and integration testing using Jest to maintain code quality and reduce bugs in production.\nParticipated in Agile ceremonies including daily standups, sprint reviews, and retrospectives.',
            technologies: 'ReactJS, JavaScript(ES6), HTML5, CSS3, Redux, Jest, Java (backend), REST APIs, Git'
        },
        {
            id: 2,
            title: 'ENVIRONMENTAL SUSTAINABILITY PLATFORM',
            description: 'It is a web-based analytics platform designed to help companies and factories monitor their carbon footprint. The platform delivers actionable insights through dynamic dashboards, encouraging organizations to adopt greener practices by analyzing energy usage and emissions.',
            roles: 'Developed high-performance, reusable React components to build dashboards that visualize emission data.\nImplemented React Query and Axios for efficient data fetching and caching, improving app responsiveness.\nCollaborated with the back-end team to consume and render real-time data via APIs.\nApplied dynamic routing and conditional rendering for a smooth user experience across categories.\nEnsured web accessibility compliance (ARIA roles, keyboard navigation) and optimized the app for SEO.\nTransformed UI wireframes from Sketch into responsive layouts using modern CSS techniques.',
            technologies: 'ReactJS, Redux, React Query, Axios, JavaScript, HTML5, CSS3, Jest, Git, Agile, Sketch, REST APIs'
        },
        {
            id: 3,
            title: 'CRYPTO EXCHANGE PLATFORM',
            description: 'A high-performance cryptocurrency exchange platform enabling users to track, buy, and sell digital assets in real time. The system offers live market feeds, user account management, and secure data operations tailored for retail traders.',
            roles: 'Designed and developed interactive dashboards using ReactJS, integrating real-time updates via WebSockets.\nUsed Axios with interceptors for secure API transactions, enhancing error handling and token management.\nImplemented modern UI libraries such as Ant Design and Chakra UI for consistent, styled components.\nBuilt and managed global app state using Redux and Jotai, ensuring fast and predictable updates.\nCollaborated closely with backend developers using Node.js to ensure seamless end-to-end functionality.',
            technologies: 'ReactJS, Redux, Chakra UI, Ant Design, WebSockets, Jotai, Axios, Node.js, Figma, JavaScript (ES6), HTML5, CSS3'
        }
    ],
    education: classicData.education,
    strengths: "Positive Attitude, Self-Confidence, Quick Learner, Team Work, Energetic, Result Oriented."
};

import { useLayout } from '../context/LayoutContext';

const SubItemWrapper = ({ title, activeTemplate, index, moveItem, onRemove, onCopy, defaultExpanded = true, globalExpand, children }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    useEffect(() => {
        if (globalExpand !== undefined) {
            setIsExpanded(globalExpand);
        }
    }, [globalExpand]);

    if (![1, 2, 3, 4, 5, 6].includes(activeTemplate)) {
        return (
            <div className="p-4 border rounded-md bg-gray-50 relative group mb-3">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={onRemove}
                    className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
                <h4 className="text-sm font-semibold text-gray-500 mb-3">{title}</h4>
                {children}
            </div>
        );
    }

    const handleDragStart = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData('subitem-index', index.toString());
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            e.target.classList.add('opacity-50');
        }, 0);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const dragIndexStr = e.dataTransfer.getData('subitem-index');
        if (dragIndexStr && !isNaN(parseInt(dragIndexStr, 10))) {
            const dragIndex = parseInt(dragIndexStr, 10);
            if (dragIndex !== index) {
                moveItem(dragIndex, index);
            }
        }
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('opacity-50');
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            className="border border-gray-200 rounded-md bg-white mb-3 shadow-sm hover:border-blue-300 transition-colors relative group"
        >
            <div
                className={`flex items-center justify-between cursor-pointer select-none bg-gray-50/80 px-3 py-1.5 hover:bg-gray-100 transition-colors ${isExpanded ? 'border-b rounded-t-md' : 'rounded-md'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <div className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-gray-200 rounded transition-colors" onClick={(e) => e.stopPropagation()}>
                        <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    <h4 className="font-semibold text-gray-700 text-sm">{title}</h4>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className={`h-7 w-7 transition-all duration-200 ${isExpanded ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50/50'}`}
                        title={isExpanded ? "Collapse" : "Expand"}
                    >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onCopy) onCopy();
                        }}
                        className="h-7 w-7 text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Duplicate"
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            {isExpanded && (
                <div className="p-4 bg-white rounded-b-md">
                    {children}
                </div>
            )}
        </div>
    );
};

const SectionWrapper = ({
    id, title, activeTemplate, expandedSections, sectionOrder,
    onDragStart, onDragOver, onDrop, onToggle, children
}) => {
    if (![1, 2, 3, 4, 5, 6].includes(activeTemplate)) {
        return <>{children}</>;
    }
    const isExpanded = expandedSections[id];
    const orderIndex = sectionOrder.indexOf(id);

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, id)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, id)}
            className="border border-gray-200 shadow-sm bg-white hover:border-blue-400 transition-colors"
            style={{ order: orderIndex >= 0 ? orderIndex : 99, borderRadius: '8px' }}
        >
            <div
                className="bg-gray-50/80 px-4 py-2.5 flex items-center justify-between border-b cursor-pointer select-none hover:bg-gray-100/80 transition-colors"
                style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                onClick={() => onToggle(id)}
            >
                <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing shrink-0" />
                    <h3 className="font-bold text-gray-800 text-[15px]">{title}</h3>
                </div>
                <div className="flex items-center pl-4">
                    <div className={`p-1.5 rounded-full transition-all duration-300 ${isExpanded ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="p-4 bg-white space-y-4" style={{ borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

const ResumeBuilder = () => {
    const { setIsOpen } = useLayout();

    // Collapse Sidebar on Component Mount to maximize space
    useEffect(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    // Helper to format skills array for input display (handling __BREAK__)
    const formatSkillsForInput = (skillsArr) => {
        if (!skillsArr) return '';
        return skillsArr.reduce((acc, curr) => {
            if (curr === '__BREAK__') return acc + '\n';
            // If the accumulator is empty or ends with a newline, don't add a comma
            const separator = (acc === '' || acc.endsWith('\n')) ? '' : ', ';
            return acc + separator + curr;
        }, '');
    };

    // Default form data - initially set to Classic Data
    const [activeTemplate, setActiveTemplate] = useState(1);
    const [formData, setFormData] = useState(classicData);
    const [skillsInput, setSkillsInput] = useState(formatSkillsForInput(classicData.skills));
    const printRef = useRef();
    const resumeRef = useRef(null);

    // Drag & Drop / Collapsible State for Template 1
    const defaultSectionOrder = ['personal', 'summary', 'skills', 'experience', 'projects', 'education', 'strengths'];
    const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder);
    const [expandedSections, setExpandedSections] = useState({
        personal: true, summary: true, skills: true, experience: true, projects: true, education: true, strengths: true
    });
    const [allExpanded, setAllExpanded] = useState(true);

    const [expandAllExperiences, setExpandAllExperiences] = useState(true);
    const [expandAllProjects, setExpandAllProjects] = useState(true);
    const [expandAllSkills, setExpandAllSkills] = useState(true);
    const [showTemplateSelection, setShowTemplateSelection] = useState(false);

    const toggleAllSections = (checked) => {
        setAllExpanded(checked);
        setExpandedSections({
            personal: checked, summary: checked, skills: checked, experience: checked, projects: checked, education: checked, strengths: checked
        });
    };

    const toggleSection = (id) => {
        setExpandedSections(prev => {
            const next = { ...prev, [id]: !prev[id] };
            const allChecked = Object.values(next).every(v => v);
            setAllExpanded(allChecked);
            return next;
        });
    };

    const moveExperience = (dragIndex, hoverIndex) => {
        setFormData((prev) => {
            const newExp = [...prev.experience];
            const draggedItem = newExp[dragIndex];
            newExp.splice(dragIndex, 1);
            newExp.splice(hoverIndex, 0, draggedItem);
            return { ...prev, experience: newExp };
        });
    };

    const moveProject = (dragIndex, hoverIndex) => {
        setFormData((prev) => {
            const newProj = [...prev.projects];
            const draggedItem = newProj[dragIndex];
            newProj.splice(dragIndex, 1);
            newProj.splice(hoverIndex, 0, draggedItem);
            return { ...prev, projects: newProj };
        });
    };

    const moveResumeSixSkill = (dragIndex, hoverIndex) => {
        setFormData((prev) => {
            const newSkills = [...prev.resumeSixSkills];
            const draggedItem = newSkills[dragIndex];
            newSkills.splice(dragIndex, 1);
            newSkills.splice(hoverIndex, 0, draggedItem);
            return { ...prev, resumeSixSkills: newSkills };
        });
    };

    const handleDragStart = (e, id) => {
        if (![1, 2, 3, 4, 5, 6].includes(activeTemplate)) return;
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        if (![1, 2, 3, 4, 5, 6].includes(activeTemplate)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetId) => {
        if (![1, 2, 3, 4, 5, 6].includes(activeTemplate)) return;
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId === targetId) return;

        const newOrder = [...sectionOrder];
        const dragIndex = newOrder.indexOf(draggedId);
        const targetIndex = newOrder.indexOf(targetId);

        newOrder.splice(dragIndex, 1);
        newOrder.splice(targetIndex, 0, draggedId);
        setSectionOrder(newOrder);
        setFormData(prev => ({ ...prev, sectionOrder: newOrder }));
    };



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
        let selectedData = classicData;

        if (templateId === 1) selectedData = classicData;
        else if (templateId === 2) selectedData = modernData;
        else if (templateId === 3) selectedData = rakeshData;
        else if (templateId === 4) selectedData = sunnyData;
        else if (templateId === 5) selectedData = blackData;
        else if (templateId === 6) selectedData = proRedData;
        else selectedData = classicData;

        setFormData(selectedData);
        setSkillsInput(formatSkillsForInput(selectedData.skills));

        // Reset layout & expansion states completely
        setSectionOrder(defaultSectionOrder);
        setAllExpanded(true);
        setExpandedSections({
            personal: true, summary: true, skills: true, experience: true, projects: true, education: true, strengths: true
        });
        setExpandAllExperiences(true);
        setExpandAllProjects(true);
        setExpandAllSkills(true);
    };

    // Skills handling
    useEffect(() => {
        // Split by newline first to preserve row structure
        const lines = skillsInput.split('\n');
        const processedSkills = [];

        lines.forEach((line, index) => {
            // Split line by comma
            const items = line.split(',').map(s => s.trim()).filter(s => s !== '');
            if (items.length > 0) {
                processedSkills.push(...items);
            }
            // Add break if it's not the last line (essentially preserving the enter key)
            // We adding it even if the line was empty to allow spacing if needed, 
            // or we can restrict it. Let's allowing "Visual" spacing.
            if (index < lines.length - 1) {
                processedSkills.push('__BREAK__');
            }
        });

        // Filter out consecutive breaks if necessary, or just set it. 
        // For simplicity, we trust the input structure.
        setFormData(prev => ({ ...prev, skills: processedSkills }));
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

    const copyExperience = (id) => {
        const itemToCopy = formData.experience.find(exp => exp.id === id);
        if (!itemToCopy) return;

        const newId = formData.experience.length > 0 ? Math.max(...formData.experience.map(e => e.id)) + 1 : 1;
        setFormData({
            ...formData,
            experience: [
                ...formData.experience,
                { ...itemToCopy, id: newId }
            ]
        });
    };

    const addProject = () => {
        const newId = formData.projects.length > 0 ? Math.max(...formData.projects.map(p => p.id)) + 1 : 1;
        setFormData(prev => ({
            ...prev,
            projects: [...prev.projects, { id: newId, title: '', role: '', roles: '', contributions: '', description: '', technologies: '' }]
        }));
    };

    const removeProject = (id) => {
        setFormData({
            ...formData,
            projects: formData.projects.filter(proj => proj.id !== id)
        });
    };

    const copyProject = (id) => {
        const itemToCopy = formData.projects.find(proj => proj.id === id);
        if (!itemToCopy) return;

        const newId = formData.projects.length > 0 ? Math.max(...formData.projects.map(p => p.id)) + 1 : 1;
        setFormData({
            ...formData,
            projects: [
                ...formData.projects,
                { ...itemToCopy, id: newId }
            ]
        });
    };

    const handleResumeSixSkillChange = (id, field, value) => {
        const updatedSkills = formData.resumeSixSkills.map(skill =>
            skill.id === id ? { ...skill, [field]: value } : skill
        );
        setFormData({ ...formData, resumeSixSkills: updatedSkills });
    };

    const addResumeSixSkill = () => {
        const newId = formData.resumeSixSkills.length > 0 ? Math.max(...formData.resumeSixSkills.map(s => s.id)) + 1 : 1;
        setFormData({
            ...formData,
            resumeSixSkills: [
                ...formData.resumeSixSkills,
                { id: newId, label: 'New Category', value: '' }
            ]
        });
    };

    const removeResumeSixSkill = (id) => {
        setFormData({
            ...formData,
            resumeSixSkills: formData.resumeSixSkills.filter(skill => skill.id !== id)
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
            <style>{`
                .resume-editor-form label,
                .resume-editor-form [data-slot="label"] {
                    font-size: 13px !important;
                    font-weight: 600 !important;
                    color: #4b5563 !important;
                    margin-bottom: 4px !important;
                    display: block;
                }
                .resume-editor-form input[type="text"],
                .resume-editor-form input[type="email"],
                .resume-editor-form input[type="tel"],
                .resume-editor-form input[type="url"],
                .resume-editor-form input:not([type="checkbox"]):not([type="color"]),
                .resume-editor-form textarea,
                .resume-editor-form select {
                    font-size: 13px !important;
                    padding: 8px 12px !important;
                }
                .resume-editor-form .grid.gap-2 {
                    gap: 8px !important;
                }
                .resume-editor-form .space-y-4 > * + * {
                    margin-top: 14px !important;
                }
            `}</style>
            {/* Page Header - Outside Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent pb-2">
                        Resume Builder
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                        Create professional resumes with a custom theme.
                    </p>
                </div>
            </div>

            {/* Template Selection */}
            <div className={showTemplateSelection ? 'mb-4' : 'mb-1'}>
                <div
                    className="flex items-center justify-between px-5 py-3.5 rounded-xl cursor-pointer select-none transition-all duration-200 border shadow-sm hover:shadow-md group"
                    style={{
                        background: showTemplateSelection
                            ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        borderColor: showTemplateSelection ? '#93c5fd' : '#e2e8f0'
                    }}
                    onClick={() => setShowTemplateSelection(prev => !prev)}
                >
                    <div className="flex items-center gap-3">
                        <span className="w-1.5 h-7 bg-blue-600 rounded-full"></span>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Choose Template</h3>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${showTemplateSelection
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-500'
                            }`}>
                            {showTemplateSelection ? 'Showing' : `Template ${activeTemplate}`}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold hidden sm:block text-blue-600">
                            {showTemplateSelection ? 'Click to collapse' : 'Click to expand'}
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`w-5 h-5 transition-all duration-300 ${showTemplateSelection
                                ? 'rotate-180 text-blue-600'
                                : 'rotate-0 text-gray-400 group-hover:text-blue-500'
                                }`}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
                {showTemplateSelection && (
                    <div className="flex gap-6 overflow-x-auto p-4 pb-4 mt-4 mb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {/* Template 1 Thumbnail */}
                        <div
                            onClick={() => handleTemplateChange(1)}
                            className={`cursor-pointer group relative rounded-xl transition-all duration-300 w-44 h-60 shrink-0 flex flex-col p-1
                            ${activeTemplate === 1
                                    ? 'ring-2 ring-offset-4 ring-blue-600 scale-100 shadow-2xl bg-white'
                                    : 'hover:ring-2 hover:ring-offset-2 hover:ring-blue-300 hover:shadow-lg hover:-translate-y-1 bg-white'}`}
                        >
                            <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 relative bg-white">
                                <div className="absolute top-0 left-0 transform scale-[0.2] origin-top-left w-[210mm] h-[297mm] pointer-events-none select-none bg-white">
                                    <ResumeTemplate data={classicData} />
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
                            <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 relative bg-white">
                                <div className="absolute top-2 left-0 transform scale-[0.2] origin-top-left w-[210mm] h-[297mm] pointer-events-none select-none bg-white px-8">
                                    <ResumeTemplateTwo data={modernData} />
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
                            <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 relative bg-white">
                                <div className="absolute top-0 left-0 transform scale-[0.2] origin-top-left w-[210mm] h-[297mm] pointer-events-none select-none bg-white">
                                    <ResumeTemplateThree data={rakeshData} />
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
                            <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 relative bg-white">
                                <div className="absolute top-0 left-0 transform scale-[0.2] origin-top-left w-[210mm] h-[297mm] pointer-events-none select-none bg-white">
                                    <ResumeTemplateFour data={sunnyData} />
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

                        {/* Template 5 Thumbnail - Black & White */}
                        <div
                            onClick={() => handleTemplateChange(5)}
                            className={`cursor-pointer group relative rounded-xl transition-all duration-300 w-44 h-60 shrink-0 flex flex-col p-1
                            ${activeTemplate === 5
                                    ? 'ring-2 ring-offset-4 ring-black scale-100 shadow-2xl bg-white'
                                    : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-400 hover:shadow-lg hover:-translate-y-1 bg-white'}`}
                        >
                            <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 relative bg-white">
                                <div className="absolute top-0 left-0 transform scale-[0.2] origin-top-left w-[210mm] h-[297mm] pointer-events-none select-none bg-white">
                                    <ResumeTemplateFive data={blackData} />
                                </div>
                                {activeTemplate === 5 && (
                                    <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white shadow-md z-20">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                )}
                            </div>
                            <div className={`mt-2 text-center text-sm font-semibold transition-colors ${activeTemplate === 5 ? 'text-black' : 'text-gray-500'}`}>
                                Black & White
                            </div>
                        </div>

                        {/* Template 6 Thumbnail - Pro Red */}
                        <div
                            onClick={() => handleTemplateChange(6)}
                            className={`cursor-pointer group relative rounded-xl transition-all duration-300 w-44 h-60 shrink-0 flex flex-col p-1
                            ${activeTemplate === 6
                                    ? 'ring-2 ring-offset-4 ring-[#EF4E65] scale-100 shadow-2xl bg-white'
                                    : 'hover:ring-2 hover:ring-offset-2 hover:ring-red-300 hover:shadow-lg hover:-translate-y-1 bg-white'}`}
                        >
                            <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 relative bg-white">
                                <div className="absolute top-0 left-0 transform scale-[0.2] origin-top-left w-[210mm] h-[297mm] pointer-events-none select-none bg-white">
                                    <ResumeTemplateSix data={proRedData} />
                                </div>
                                {activeTemplate === 6 && (
                                    <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#EF4E65] rounded-full flex items-center justify-center text-white shadow-md z-20">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                )}
                            </div>
                            <div className={`mt-2 text-center text-sm font-semibold transition-colors ${activeTemplate === 6 ? 'text-[#EF4E65]' : 'text-gray-500'}`}>
                                Customizable
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                {/* Editor Section */}
                <div className="space-y-6">

                    <Card
                        className="resume-editor-form p-6 border border-white/60 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/60 ring-1 ring-black/5"
                        style={{
                            boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)"
                        }}
                    >
                        <div className="flex flex-col gap-6 h-[650px] xl:h-[950px] overflow-y-auto pr-2 pb-6">
                            {[1, 2, 3, 4, 5, 6].includes(activeTemplate) && (
                                <div className="sticky top-0 z-20 pb-1" style={{ order: -1 }}>
                                    <Button
                                        variant="default"
                                        onClick={() => toggleAllSections(!allExpanded)}
                                        className="w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] border-none group"
                                        style={{ background: 'linear-gradient(135deg, #3a5f9e 0%, #5283c5 50%, #6fa8dc 100%)' }}
                                    >
                                        {allExpanded ? (
                                            <>
                                                <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                                                <span className="tracking-tight">Collapse All Sections</span>
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                                                <span className="tracking-tight">Expand All Sections</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* Personal Details */}
                            <SectionWrapper
                                id="personal"
                                title="Personal Details"
                                activeTemplate={activeTemplate}
                                expandedSections={expandedSections}
                                sectionOrder={sectionOrder}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onToggle={toggleSection}
                            >
                                <div className="space-y-4">
                                    {![1, 2, 3, 4, 5, 6].includes(activeTemplate) && <h3 className='font-bold text-lg text-gray-800 border-b pb-2'>Personal Details</h3>}
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
                                        {activeTemplate === 6 && (
                                            <div className='grid gap-2 md:col-span-2'>
                                                <Label htmlFor='experience_years'>Years of Experience (Total)</Label>
                                                <Input
                                                    id='experience_years'
                                                    value={formData.experience_years}
                                                    onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                                                    placeholder='e.g. 4+'
                                                />
                                            </div>
                                        )}
                                        {(activeTemplate === 1 || activeTemplate === 2 || activeTemplate === 3 || activeTemplate === 4 || activeTemplate === 5 || activeTemplate === 6) && (
                                            <div className="grid gap-4 md:col-span-2 p-4 bg-gray-50/50 rounded-xl border border-gray-100 mt-2">
                                                <div className='flex items-center gap-2 mb-1'>
                                                    <div className='w-1.5 h-4 bg-blue-500 rounded-full'></div>
                                                    <span className='font-bold text-sm text-gray-700 uppercase tracking-wider'>Color Customization</span>
                                                </div>

                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                                    <div className='grid gap-2'>
                                                        <Label htmlFor='themeColor' className="text-xs font-semibold text-gray-500">Primary Theme Color</Label>
                                                        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                                                            <input
                                                                type="color"
                                                                id="themeColor"
                                                                value={formData.themeColor || (activeTemplate === 1 ? '#002b7f' : activeTemplate === 2 ? '#124f44' : activeTemplate === 4 ? '#0891b2' : activeTemplate === 5 ? '#111827' : '#3b82f6')}
                                                                onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                                                                className="w-10 h-10 p-1 rounded-md border border-gray-200 cursor-pointer transition-transform hover:scale-105"
                                                            />
                                                            <span className="text-sm text-gray-600 font-mono font-bold uppercase select-all">{formData.themeColor || (activeTemplate === 1 ? '#002b7f' : activeTemplate === 2 ? '#124f44' : activeTemplate === 4 ? '#0891b2' : activeTemplate === 5 ? '#111827' : '#3b82f6')}</span>
                                                        </div>
                                                    </div>

                                                    {(activeTemplate === 1 || activeTemplate === 2) && (
                                                        <div className='grid gap-2'>
                                                            <Label htmlFor='secondaryColor' className="text-xs font-semibold text-gray-500">Secondary Accent Color</Label>
                                                            <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                                                                <input
                                                                    type="color"
                                                                    id="secondaryColor"
                                                                    value={formData.secondaryColor || (activeTemplate === 1 ? '#f96b07' : '#3cb371')}
                                                                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                                                    className="w-10 h-10 p-1 rounded-md border border-gray-200 cursor-pointer transition-transform hover:scale-105"
                                                                />
                                                                <span className="text-sm text-gray-600 font-mono font-bold uppercase select-all">{formData.secondaryColor || (activeTemplate === 1 ? '#f96b07' : '#3cb371')}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SectionWrapper>

                            <SectionWrapper
                                id="summary"
                                title="Profile Summary"
                                activeTemplate={activeTemplate}
                                expandedSections={expandedSections}
                                sectionOrder={sectionOrder}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onToggle={toggleSection}
                            >
                                <div className="space-y-4">
                                    {![1, 2, 3, 4, 5, 6].includes(activeTemplate) && <h3 className='font-bold text-lg text-gray-800 border-b pb-2'>Profile Summary</h3>}

                                    {activeTemplate !== 6 ? (
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
                                    ) : (
                                        <div className="grid gap-2">
                                            <Label htmlFor="coreCompetencies" className="text-xs font-bold">Core Competencies (One per line)</Label>
                                            <Textarea
                                                id="coreCompetencies"
                                                value={Array.isArray(formData.coreCompetencies) ? formData.coreCompetencies.join('\n') : formData.coreCompetencies || ''}
                                                onChange={(e) => setFormData({ ...formData, coreCompetencies: e.target.value.split('\n') })}
                                                placeholder="Enter each competency on a new line"
                                                className="text-sm min-h-[120px]"
                                            />
                                        </div>
                                    )}
                                </div>
                            </SectionWrapper>

                            {/* Skills */}
                            <SectionWrapper
                                id="skills"
                                title="Skills"
                                activeTemplate={activeTemplate}
                                expandedSections={expandedSections}
                                sectionOrder={sectionOrder}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onToggle={toggleSection}
                            >
                                <div className="space-y-4">
                                    {![1, 2, 3, 4, 5, 6].includes(activeTemplate) && <h3 className='font-bold text-lg text-gray-800 border-b pb-2'>Skills</h3>}
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
                                    {(activeTemplate === 5 || activeTemplate === 6) && (
                                        <div className="space-y-4 pt-2 border-t mt-2">
                                            <div className="flex justify-between items-center border-b pb-2 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-sm text-gray-700">{activeTemplate === 6 ? 'Detailed Skill Categories' : 'Detailed Technical Skills (Required)'}</h4>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setExpandAllSkills(!expandAllSkills)}
                                                        className={`h-7 px-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ml-2 flex items-center gap-1.5 ${expandAllSkills ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                    >
                                                        {expandAllSkills ? (
                                                            <>
                                                                <ChevronUp className="w-3 h-3" />
                                                                Collapse All
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="w-3 h-3" />
                                                                Expand All
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                                <Button size="sm" variant="ghost" onClick={addResumeSixSkill} className="h-7 text-[10px] text-blue-600 hover:bg-blue-50 border border-blue-100">
                                                    <Plus className="w-3 h-3 mr-1" /> Add Category
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                {formData.resumeSixSkills && formData.resumeSixSkills.map((skill, index) => (
                                                    <SubItemWrapper
                                                        key={skill.id || index}
                                                        title={skill.label || `Category #${index + 1}`}
                                                        activeTemplate={activeTemplate}
                                                        index={index}
                                                        moveItem={moveResumeSixSkill}
                                                        onRemove={() => removeResumeSixSkill(skill.id)}
                                                        defaultExpanded={true}
                                                        globalExpand={expandAllSkills}
                                                    >
                                                        <div className="grid gap-2">
                                                            <div className="grid gap-2">
                                                                <Label className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Category Name</Label>
                                                                <Input
                                                                    value={skill.label}
                                                                    onChange={(e) => handleResumeSixSkillChange(skill.id, 'label', e.target.value)}
                                                                    placeholder="e.g. Languages"
                                                                    className="h-8 text-xs font-bold bg-white border-blue-100 shadow-sm focus-visible:ring-blue-400"
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Skills / Details</Label>
                                                                <Textarea
                                                                    value={skill.value}
                                                                    onChange={(e) => handleResumeSixSkillChange(skill.id, 'value', e.target.value)}
                                                                    placeholder="Description (use Enter for new lines)"
                                                                    className="text-xs min-h-[80px] py-2 bg-white border-blue-50"
                                                                />
                                                            </div>
                                                        </div>
                                                    </SubItemWrapper>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </SectionWrapper>

                            {/* Experience */}
                            <SectionWrapper
                                id="experience"
                                title="Work Experience"
                                activeTemplate={activeTemplate}
                                expandedSections={expandedSections}
                                sectionOrder={sectionOrder}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onToggle={toggleSection}
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        {![1, 2, 3, 4, 5, 6].includes(activeTemplate) ? <h3 className='font-bold text-lg text-gray-800'>Work Experience</h3> : (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setExpandAllExperiences(!expandAllExperiences)}
                                                    className={`h-7 px-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${expandAllExperiences ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                >
                                                    {expandAllExperiences ? (
                                                        <>
                                                            <ChevronUp className="w-3 h-3" />
                                                            Collapse All Items
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="w-3 h-3" />
                                                            Expand All Items
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                        <Button size="sm" variant="outline" onClick={addExperience} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                            <Plus className="w-4 h-4 mr-1" /> Add
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {formData.experience.map((exp, index) => (
                                            <SubItemWrapper
                                                key={exp.id || index}
                                                title={`${index + 1}${exp.company ? ` - ${exp.company}` : ''}`}
                                                activeTemplate={activeTemplate}
                                                index={index}
                                                moveItem={moveExperience}
                                                onRemove={() => removeExperience(exp.id)}
                                                onCopy={() => copyExperience(exp.id)}
                                                defaultExpanded={true}
                                                globalExpand={expandAllExperiences}
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                    <div className="grid gap-2">
                                                        <Label className="text-xs">Job Title</Label>
                                                        <Textarea
                                                            value={exp.title}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                                                            className="text-sm min-h-[38px] py-2"
                                                            rows={1}
                                                            placeholder="e.g. Senior Developer"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label className="text-xs">Company Name</Label>
                                                        <Textarea
                                                            value={exp.company}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                                            className="text-sm min-h-[38px] py-1"
                                                            rows={1}
                                                            placeholder="e.g. Tech Corp"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2 md:col-span-2">
                                                        <Label className="text-xs">Company Short Description</Label>
                                                        <Textarea
                                                            value={exp.companyDescription}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'companyDescription', e.target.value)}
                                                            className="text-sm min-h-[38px] py-2 italic text-gray-600 bg-gray-50"
                                                            rows={1}
                                                            placeholder="e.g. A company specializing in web application development."
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label className="text-xs">Start Date</Label>
                                                        <Input
                                                            value={exp.startDate}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                                                            className="h-8 text-sm"
                                                            placeholder="e.g. Jun 2020"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label className="text-xs">End Date</Label>
                                                        <Input
                                                            value={exp.endDate}
                                                            onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                                                            className="h-8 text-sm"
                                                            placeholder="e.g. Present"
                                                        />
                                                    </div>
                                                    <div className="grid gap-2 md:col-span-2">
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
                                                <div className="grid gap-2">
                                                    <Label className="text-xs">Description</Label>
                                                    <Textarea
                                                        rows={3}
                                                        value={exp.description}
                                                        onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                                                        className="text-sm"
                                                        placeholder="Describe your roles and responsibilities..."
                                                    />
                                                </div>
                                            </SubItemWrapper>
                                        ))}
                                    </div>
                                </div>
                            </SectionWrapper>

                            {/* Projects */}
                            <SectionWrapper
                                id="projects"
                                title="Projects"
                                activeTemplate={activeTemplate}
                                expandedSections={expandedSections}
                                sectionOrder={sectionOrder}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onToggle={toggleSection}
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        {![1, 2, 3, 4, 5, 6].includes(activeTemplate) ? <h3 className='font-bold text-lg text-gray-800'>Projects</h3> : (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setExpandAllProjects(!expandAllProjects)}
                                                    className={`h-7 px-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${expandAllProjects ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                >
                                                    {expandAllProjects ? (
                                                        <>
                                                            <ChevronUp className="w-3 h-3" />
                                                            Collapse All Items
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="w-3 h-3" />
                                                            Expand All Items
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                        <Button size="sm" variant="outline" onClick={addProject} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                            <Plus className="w-4 h-4 mr-1" /> Add
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {formData.projects.map((proj, index) => (
                                            <SubItemWrapper
                                                key={proj.id || index}
                                                title={`${index + 1}${proj.title ? ` - ${proj.title}` : ''}`}
                                                activeTemplate={activeTemplate}
                                                index={index}
                                                moveItem={moveProject}
                                                defaultExpanded={true}
                                                globalExpand={expandAllProjects}
                                                onRemove={() => removeProject(proj.id)}
                                                onCopy={() => copyProject(proj.id)}
                                            >
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="grid gap-2">
                                                            <Label className="text-xs font-bold text-gray-500">Project Title</Label>
                                                            <Input
                                                                value={proj.title || ''}
                                                                onChange={(e) => {
                                                                    const updated = formData.projects.map(p => p.id === proj.id ? { ...p, title: e.target.value } : p);
                                                                    setFormData({ ...formData, projects: updated });
                                                                }}
                                                                placeholder="e.g. BANKING APPLICATION"
                                                                className="h-9 text-sm font-bold border-blue-100 focus-visible:ring-blue-400"
                                                            />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label className="text-xs font-bold text-gray-500">Your Role</Label>
                                                            <Input
                                                                value={proj.role || ''}
                                                                onChange={(e) => {
                                                                    const updated = formData.projects.map(p => p.id === proj.id ? { ...p, role: e.target.value } : p);
                                                                    setFormData({ ...formData, projects: updated });
                                                                }}
                                                                placeholder="e.g. Lead Frontend Developer"
                                                                className="h-9 text-sm border-blue-100 focus-visible:ring-blue-400"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-bold text-gray-500">Project Brief</Label>
                                                        <Textarea
                                                            rows={3}
                                                            value={proj.description || ''}
                                                            onChange={(e) => {
                                                                const updated = formData.projects.map(p => p.id === proj.id ? { ...p, description: e.target.value } : p);
                                                                setFormData({ ...formData, projects: updated });
                                                            }}
                                                            placeholder="Describe the project goal..."
                                                            className="text-sm border-blue-100 bg-white"
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-bold text-gray-500">Roles and Responsibilities</Label>
                                                        <Textarea
                                                            rows={5}
                                                            value={proj.roles || proj.contributions || ''}
                                                            onChange={(e) => {
                                                                const updated = formData.projects.map(p => p.id === proj.id ? { ...p, roles: e.target.value, contributions: e.target.value } : p);
                                                                setFormData({ ...formData, projects: updated });
                                                            }}
                                                            placeholder="Use Enter for new bullet points..."
                                                            className="text-sm border-blue-100 bg-white"
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label className="text-xs font-bold text-gray-500">Technology Stack</Label>
                                                        <Textarea
                                                            rows={2}
                                                            value={proj.technologies || ''}
                                                            onChange={(e) => {
                                                                const updated = formData.projects.map(p => p.id === proj.id ? { ...p, technologies: e.target.value } : p);
                                                                setFormData({ ...formData, projects: updated });
                                                            }}
                                                            placeholder="e.g. ReactJS, Redux, Node.js..."
                                                            className="text-sm border-blue-100 bg-white"
                                                        />
                                                    </div>
                                                </div>
                                            </SubItemWrapper>
                                        ))}
                                    </div>
                                </div>
                            </SectionWrapper>

                            {/* Education */}
                            <SectionWrapper
                                id="education"
                                title="Education"
                                activeTemplate={activeTemplate}
                                expandedSections={expandedSections}
                                sectionOrder={sectionOrder}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onToggle={toggleSection}
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        {![1, 2, 3, 4, 5, 6].includes(activeTemplate) ? <h3 className='font-bold text-lg text-gray-800'>Education</h3> : <div className="hidden"></div>}
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
                                                    <div className="grid gap-2">
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
                                                    <div className="grid gap-2">
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
                                                    <div className="grid gap-2">
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
                                                    <div className="grid gap-2">
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
                            </SectionWrapper>

                            <SectionWrapper
                                id="strengths"
                                title="Strengths"
                                activeTemplate={activeTemplate}
                                expandedSections={expandedSections}
                                sectionOrder={sectionOrder}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onToggle={toggleSection}
                            >
                                <div className="space-y-4">
                                    {![1, 2, 3, 4, 5, 6].includes(activeTemplate) && <h3 className='font-bold text-lg text-gray-800 border-b pb-2'>Strengths</h3>}
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
                            </SectionWrapper>
                        </div>
                    </Card>

                    <div className='mt-4 mb-6'>
                        <Button
                            className='w-full bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white shadow-lg font-semibold h-12 rounded-xl hover:shadow-xl hover:scale-[1.01] transition-all duration-200'
                            onClick={handlePrint}
                        >
                            <Printer className='mr-2 h-5 w-5' /> Print / Save as PDF
                        </Button>
                    </div>
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
                                        ) : activeTemplate === 4 ? (
                                            <ResumeTemplateFour data={formData} />
                                        ) : activeTemplate === 5 ? (
                                            <ResumeTemplateFive data={formData} />
                                        ) : activeTemplate === 6 ? (
                                            <ResumeTemplateSix data={formData} />
                                        ) : (
                                            <ResumeTemplateFive data={formData} />
                                        )}
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
                    {activeTemplate === 1 && <ResumeTemplate data={formData} />}
                    {activeTemplate === 2 && <ResumeTemplateTwo data={formData} />}
                    {activeTemplate === 3 && <ResumeTemplateThree data={formData} />}
                    {activeTemplate === 4 && <ResumeTemplateFour data={formData} />}
                    {activeTemplate === 5 && <ResumeTemplateFive data={formData} />}
                    {activeTemplate === 6 && <ResumeTemplateSix data={formData} />}
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;

