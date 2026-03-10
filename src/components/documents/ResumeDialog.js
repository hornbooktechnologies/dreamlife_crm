import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

import { Plus, Trash2, Printer } from 'lucide-react';
import ResumeTemplate from './ResumeTemplate';
import ResumeTemplateTwo from './ResumeTemplateTwo';
import ResumeTemplateThree from './ResumeTemplateThree';
import ResumeTemplateFour from './ResumeTemplateFour';
import ResumeTemplateFive from './ResumeTemplateFive';
import ResumeTemplateSix from './ResumeTemplateSix';

const ResumeDialog = ({ isOpen, setIsOpen, employee }) => {
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        phone: '',
        email: '',
        location: '',
        summary: '',
        skills: [], // Store as array of strings
        experience: [
            {
                id: 1,
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                description: '',
                companyDescription: '',
            }
        ],
        education: [
            {
                id: 1,
                degree: '',
                university: '',
                date: '',
            }
        ],
        strengths: '', // Functional Skills
        techWeb: '',
        techDatabase: '',
        techIDE: '',
        coreCompetencies: '', // For Template Six
        // Categorized skills for Template Six
        resumeSixLanguages: '',
        resumeSixFrameworks: '',
        resumeSixStateManagement: '',
        resumeSixDataViz: '',
        resumeSixApi: '',
        resumeSixDatabase: '',
        resumeSixCloud: '',
        resumeSixBuildTools: '',
        resumeSixThirdParty: '',
        resumeSixDevTools: '',
        resumeSixTesting: '',
        resumeSixCiCd: '',
        resumeSixVersionControl: '',
        resumeSixProjectManagement: '',
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
        experience_years: '4+',
    });

    const [activeTemplate, setActiveTemplate] = useState(1);

    const [skillsInput, setSkillsInput] = useState(''); // Temporary string for input

    const printRef = useRef();

    useEffect(() => {
        if (employee) {
            setFormData(prev => ({
                ...prev,
                name: `${employee.first_name || ''} ${employee.last_name || ''}`.trim(),
                designation: employee.designation || '',
                email: employee.email || '',
                phone: employee.phone_number || '',
                location: employee.address || '',
            }));
        }
    }, [employee, isOpen]);

    // Update formData.skills when skillsInput changes
    useEffect(() => {
        const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(s => s !== '');
        setFormData(prev => ({ ...prev, skills: skillsArray }));
    }, [skillsInput]);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Resume_${formData.name?.replace(/\s+/g, '_')}`,
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
                    description: '',
                    companyDescription: '',
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

    const handleEducationChange = (id, field, value) => {
        const updatedEducation = formData.education.map(edu =>
            edu.id === id ? { ...edu, [field]: value } : edu
        );
        setFormData({ ...formData, education: updatedEducation });
    };

    const addEducation = () => {
        const newId = formData.education.length > 0 ? Math.max(...formData.education.map(e => e.id)) + 1 : 1;
        setFormData({
            ...formData,
            education: [
                ...formData.education,
                {
                    id: newId,
                    degree: '',
                    university: '',
                    date: '',
                }
            ]
        });
    };

    const removeEducation = (id) => {
        setFormData({
            ...formData,
            education: formData.education.filter(edu => edu.id !== id)
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

    if (!employee) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='max-w-[95vw] lg:max-w-7xl h-[90vh] overflow-hidden p-0 gap-0 flex flex-col bg-white border-0 shadow-2xl'>
                <DialogHeader className='p-6 bg-gradient-to-r from-primary via-primary-hover to-primary text-white shrink-0'>
                    <DialogTitle className="text-2xl font-bold">Generate Resume</DialogTitle>
                    <DialogDescription className="text-blue-50">
                        Create a professional resume for <b>{formData.name}</b>.
                    </DialogDescription>
                </DialogHeader>

                <div className='flex-1 overflow-y-auto w-full bg-gray-50/50 p-6'>
                    {/* Template Selection */}
                    <div className="mb-8">
                        <Label className="text-sm font-bold text-gray-700 mb-3 block">Choose Resume Template</Label>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                <div key={num} onClick={() => setActiveTemplate(num)} className="group shrink-0 cursor-pointer">
                                    <div
                                        className={`transition-all duration-300 rounded-lg p-1 shrink-0 ${activeTemplate === num
                                            ? 'ring-2 ring-blue-600 bg-blue-50 shadow-md'
                                            : 'hover:bg-gray-100 bg-white border'
                                            }`}
                                    >
                                        <div className="w-16 h-24 bg-white border rounded shadow-sm overflow-hidden relative">
                                            {/* Simple thumbnail representation */}
                                            {num === 1 && <div className="w-full h-2 bg-blue-600 mb-1"></div>}
                                            {num === 2 && <div className="w-full h-full p-1"><div className="w-8 h-8 rounded-full bg-green-100 mb-1"></div></div>}
                                            {num === 3 && <div className="p-1"><div className="w-full h-1 bg-slate-800 mb-1"></div></div>}
                                            {num === 4 && <div className="h-full bg-slate-50 border-l-4 border-blue-500"></div>}
                                            {num === 5 && <div className="p-1 h-full flex flex-col justify-between"><div className="w-full h-0.5 bg-black"></div><div className="w-full h-0.5 bg-black"></div></div>}
                                            {num === 6 && <div className="p-1 h-full flex flex-col"><div className="w-full h-1 bg-[#EF4E65] mb-1"></div><div className="w-full h-0.5 bg-gray-300 mb-1"></div><div className="w-full h-0.5 bg-gray-300"></div></div>}

                                            <div className="space-y-1 p-1">
                                                <div className="w-full h-0.5 bg-gray-200"></div>
                                                <div className="w-full h-0.5 bg-gray-200"></div>
                                                <div className="w-2/3 h-0.5 bg-gray-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`text-[10px] text-center mt-1 font-semibold ${activeTemplate === num ? 'text-blue-700' : 'text-gray-500'}`}>
                                        {num === 1 ? 'Classic' : num === 2 ? 'Green' : num === 3 ? 'Modern' : num === 4 ? 'Luxe' : num === 5 ? 'Black & White' : 'Pro Red'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        {/* Editor Form */}
                        <div className='space-y-6 border p-6 rounded-lg bg-white shadow-sm h-fit'>

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
                                        <Label htmlFor='designation'>Designation</Label>
                                        <Input
                                            id='designation'
                                            value={formData.designation}
                                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
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
                                    <div className='grid gap-2 md:col-span-2'>
                                        <Label htmlFor='location'>Address / Location</Label>
                                        <Input
                                            id='location'
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className='font-bold text-lg text-gray-800 border-b pb-2'>Profile Summary & Strengths</h3>
                                {activeTemplate !== 6 && (
                                    <>
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
                                        <div className='grid gap-2'>
                                            <Label htmlFor='strengths'>Functional Skills (Strengths)</Label>
                                            <Textarea
                                                id='strengths'
                                                rows={3}
                                                value={formData.strengths}
                                                onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                                                placeholder="e.g. Interaction with business analysts, Sprint planning..."
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTemplate === 6 && (
                                    <div className='grid gap-2'>
                                        <Label htmlFor='coreCompetencies'>Core Competencies (one per line)</Label>
                                        <Textarea
                                            id='coreCompetencies'
                                            rows={6}
                                            value={formData.coreCompetencies}
                                            onChange={(e) => setFormData({ ...formData, coreCompetencies: e.target.value })}
                                            placeholder="Skilled in developing clean...&#10;Strong command of managing...&#10;Proficient in building..."
                                        />
                                    </div>
                                )}
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
                                {activeTemplate === 5 && (
                                    <div className="space-y-3 pt-2 border-t mt-2">
                                        <h4 className="font-semibold text-sm text-gray-700">Detailed Technical Skills (Required)</h4>
                                        <div className="grid gap-2">
                                            <Label htmlFor="techWeb" className="text-xs">Web Technologies</Label>
                                            <Input
                                                id="techWeb"
                                                value={formData.techWeb}
                                                onChange={(e) => setFormData({ ...formData, techWeb: e.target.value })}
                                                placeholder="e.g. ReactJS, HTML5, CSS3..."
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="techDatabase" className="text-xs">Database</Label>
                                            <Input
                                                id="techDatabase"
                                                value={formData.techDatabase}
                                                onChange={(e) => setFormData({ ...formData, techDatabase: e.target.value })}
                                                placeholder="e.g. MySQL, MongoDB..."
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="techIDE" className="text-xs">IDE</Label>
                                            <Input
                                                id="techIDE"
                                                value={formData.techIDE}
                                                onChange={(e) => setFormData({ ...formData, techIDE: e.target.value })}
                                                placeholder="e.g. VS Code, Sublime..."
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="techTools" className="text-xs">Code Management Tools</Label>
                                            <Input
                                                id="techTools"
                                                value={formData.techTools}
                                                onChange={(e) => setFormData({ ...formData, techTools: e.target.value })}
                                                placeholder="e.g. GitHub, BitBucket..."
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="techOther" className="text-xs">Other Tools</Label>
                                            <Input
                                                id="techOther"
                                                value={formData.techOther}
                                                onChange={(e) => setFormData({ ...formData, techOther: e.target.value })}
                                                placeholder="e.g. Jira, Slack..."
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTemplate === 6 && (
                                    <div className="space-y-3 pt-2 border-t mt-2">
                                        <h4 className="font-semibold text-sm text-gray-700">Template Specific Fields (Pro Red)</h4>
                                        <div className="grid gap-2 mb-4">
                                            <Label htmlFor="experience_years" className="text-xs">Years of Experience</Label>
                                            <Input
                                                id="experience_years"
                                                value={formData.experience_years}
                                                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                                                placeholder="e.g. 4+"
                                                className="h-8 text-sm"
                                            />
                                        </div>

                                        <div className="p-3 bg-blue-50/50 rounded-md border border-blue-100 space-y-3 mb-4">
                                            <h5 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Section Titles</h5>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="grid gap-1">
                                                    <Label className="text-[10px]">Competencies Title</Label>
                                                    <Input
                                                        value={formData.coreCompetenciesLabel || "CORE COMPETENCIES"}
                                                        onChange={(e) => setFormData({ ...formData, coreCompetenciesLabel: e.target.value })}
                                                        className="h-7 text-[11px]"
                                                    />
                                                </div>
                                                <div className="grid gap-1">
                                                    <Label className="text-[10px]">Skills Title</Label>
                                                    <Input
                                                        value={formData.skillsLabel || "SKILLS"}
                                                        onChange={(e) => setFormData({ ...formData, skillsLabel: e.target.value })}
                                                        className="h-7 text-[11px]"
                                                    />
                                                </div>
                                                <div className="grid gap-1">
                                                    <Label className="text-[10px]">Experience Title</Label>
                                                    <Input
                                                        value={formData.experienceLabel || "EXPERIENCE"}
                                                        onChange={(e) => setFormData({ ...formData, experienceLabel: e.target.value })}
                                                        className="h-7 text-[11px]"
                                                    />
                                                </div>
                                                <div className="grid gap-1">
                                                    <Label className="text-[10px]">Projects Title</Label>
                                                    <Input
                                                        value={formData.projectsLabel || "RECENT PROJECTS"}
                                                        onChange={(e) => setFormData({ ...formData, projectsLabel: e.target.value })}
                                                        className="h-7 text-[11px]"
                                                    />
                                                </div>
                                                <div className="grid gap-1">
                                                    <Label className="text-[10px]">Education Title</Label>
                                                    <Input
                                                        value={formData.educationLabel || "EDUCATION"}
                                                        onChange={(e) => setFormData({ ...formData, educationLabel: e.target.value })}
                                                        className="h-7 text-[11px]"
                                                    />
                                                </div>
                                                <div className="grid gap-1">
                                                    <Label className="text-[10px]">Experience Tag</Label>
                                                    <Input
                                                        value={formData.experienceYearsLabel || "Years of experience"}
                                                        onChange={(e) => setFormData({ ...formData, experienceYearsLabel: e.target.value })}
                                                        className="h-7 text-[11px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-2 mb-6">
                                            <Label htmlFor="coreCompetencies" className="text-xs">Core Competencies</Label>
                                            <Textarea
                                                id="coreCompetencies"
                                                value={Array.isArray(formData.coreCompetencies) ? formData.coreCompetencies.join('\n') : formData.coreCompetencies}
                                                onChange={(e) => setFormData({ ...formData, coreCompetencies: e.target.value.split('\n') })}
                                                placeholder="Enter each competency on a new line"
                                                className="text-xs min-h-[100px]"
                                            />
                                        </div>

                                        <div className="flex justify-between items-center border-b pb-1 mb-2">
                                            <Label className="text-xs font-bold text-gray-500 uppercase">Skill Categories</Label>
                                            <Button size="sm" variant="ghost" onClick={addResumeSixSkill} className="h-6 text-[10px] text-blue-600 hover:bg-blue-50">
                                                <Plus className="w-3 h-3 mr-1" /> Add Category
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            {formData.resumeSixSkills.map((skill, index) => (
                                                <div key={skill.id} className="p-3 border rounded-md bg-gray-50/30 relative group">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => removeResumeSixSkill(skill.id)}
                                                        className="absolute top-1 right-1 h-6 w-6 text-red-100 hover:text-red-600 hover:bg-red-50 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                    <div className="grid gap-2">
                                                        <Input
                                                            value={skill.label}
                                                            onChange={(e) => handleResumeSixSkillChange(skill.id, 'label', e.target.value)}
                                                            placeholder="Category Title"
                                                            className="h-7 text-xs font-bold bg-transparent border-0 border-b rounded-none focus-visible:ring-0 px-0"
                                                        />
                                                        <Textarea
                                                            value={skill.value}
                                                            onChange={(e) => handleResumeSixSkillChange(skill.id, 'value', e.target.value)}
                                                            placeholder="Description (use Enter for new lines)"
                                                            className="text-xs min-h-[60px] py-1"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                                    <Input
                                                        value={exp.title}
                                                        onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                                                        className="h-8 text-sm"
                                                        placeholder="e.g. Senior Developer"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Company Name</Label>
                                                    <Input
                                                        value={exp.company}
                                                        onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                                        className="h-8 text-sm"
                                                        placeholder="e.g. Tech Corp"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label className="text-xs">Company Description (Optional Preview)</Label>
                                                    <Input
                                                        value={exp.companyDescription}
                                                        onChange={(e) => handleExperienceChange(exp.id, 'companyDescription', e.target.value)}
                                                        className="h-8 text-sm italic text-gray-600 bg-gray-50"
                                                        placeholder="e.g. A company specializing in web applications..."
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
                                                    <Input
                                                        value={exp.location}
                                                        onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                                                        className="h-8 text-sm"
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

                            {/* Education */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <h3 className='font-bold text-lg text-gray-800'>Education</h3>
                                    <Button size="sm" variant="outline" onClick={addEducation} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                        <Plus className="w-4 h-4 mr-1" /> Add
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {formData.education.map((edu, index) => (
                                        <div key={edu.id} className="p-4 border rounded-md bg-gray-50 relative group">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => removeEducation(edu.id)}
                                                className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>

                                            <h4 className="text-sm font-semibold text-gray-500 mb-3">Education #{index + 1}</h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                <div className="md:col-span-2">
                                                    <Label className="text-xs">Degree / Certificate</Label>
                                                    <Input
                                                        value={edu.degree}
                                                        onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                                                        className="h-8 text-sm"
                                                        placeholder="e.g. Bachelor of Science in CS"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label className="text-xs">University / Institute</Label>
                                                    <Input
                                                        value={edu.university}
                                                        onChange={(e) => handleEducationChange(edu.id, 'university', e.target.value)}
                                                        className="h-8 text-sm"
                                                        placeholder="e.g. University of Technology"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label className="text-xs">Year / Date</Label>
                                                    <Input
                                                        value={edu.date}
                                                        onChange={(e) => handleEducationChange(edu.id, 'date', e.target.value)}
                                                        className="h-8 text-sm"
                                                        placeholder="e.g. 2016 - 2020"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='pt-6 border-t mt-4'>
                                <Button
                                    className='w-full bg-gradient-to-r from-primary via-primary-hover to-primary text-white shadow-lg font-semibold h-12'
                                    onClick={handlePrint}
                                >
                                    <Printer className='mr-2 h-5 w-5' /> Print / Save as PDF
                                </Button>
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className='hidden lg:flex flex-col items-center justify-start'>
                            <div className='w-full text-center mb-2 font-semibold text-gray-500'>Live Preview</div>
                            <div className='border shadow-sm rounded-lg overflow-hidden bg-gray-200 p-4 w-full flex justify-center h-fit bg-white/50 backdrop-blur-sm sticky top-0'>
                                <div className='scale-[0.65] origin-top transform-gpu shadow-2xl bg-white'>
                                    <div className='pointer-events-none select-none w-[800px]'>
                                        {activeTemplate === 1 && <ResumeTemplate data={formData} />}
                                        {activeTemplate === 2 && <ResumeTemplateTwo data={formData} />}
                                        {activeTemplate === 3 && <ResumeTemplateThree data={formData} />}
                                        {activeTemplate === 4 && <ResumeTemplateFour data={formData} />}
                                        {activeTemplate === 5 && <ResumeTemplateFive data={formData} />}
                                        {activeTemplate === 6 && <ResumeTemplateSix data={{
                                            ...formData,
                                            coreCompetencies: formData.coreCompetencies ? formData.coreCompetencies.split('\n').filter(c => c.trim() !== '') : []
                                        }} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hidden Printable Component */}
                <div className='hidden'>
                    <div ref={printRef}>
                        {activeTemplate === 1 && <ResumeTemplate data={formData} />}
                        {activeTemplate === 2 && <ResumeTemplateTwo data={formData} />}
                        {activeTemplate === 3 && <ResumeTemplateThree data={formData} />}
                        {activeTemplate === 4 && <ResumeTemplateFour data={formData} />}
                        {activeTemplate === 5 && <ResumeTemplateFive data={formData} />}
                        {activeTemplate === 6 && <ResumeTemplateSix data={{
                            ...formData,
                            coreCompetencies: formData.coreCompetencies ? formData.coreCompetencies.split('\n').filter(c => c.trim() !== '') : []
                        }} />}
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
};

export default ResumeDialog;

