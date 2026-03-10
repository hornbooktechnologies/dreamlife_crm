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

    if (!employee) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='max-w-[95vw] lg:max-w-7xl h-[90vh] overflow-hidden p-0 gap-0 flex flex-col bg-white border-0 shadow-2xl'>
                <DialogHeader className='p-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white shrink-0'>
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
                            {[1, 2, 3, 4].map((num) => (
                                <div
                                    key={num}
                                    onClick={() => setActiveTemplate(num)}
                                    className={`cursor-pointer transition-all duration-300 rounded-lg p-1 shrink-0 ${activeTemplate === num
                                        ? 'ring-2 ring-blue-600 bg-blue-50 shadow-md'
                                        : 'hover:bg-gray-100 bg-white border'
                                        }`}
                                >
                                    <div className="w-24 h-32 rounded bg-gray-50 flex items-center justify-center overflow-hidden relative">
                                        <div className="scale-[0.15] origin-top pointer-events-none w-[800px] h-[1132px] absolute top-2">
                                            {num === 1 && <ResumeTemplate data={formData} />}
                                            {num === 2 && <ResumeTemplateTwo data={formData} />}
                                            {num === 3 && <ResumeTemplateThree data={formData} />}
                                            {num === 4 && <ResumeTemplateFour data={formData} />}
                                        </div>
                                    </div>
                                    <p className={`text-[10px] text-center mt-1 font-semibold ${activeTemplate === num ? 'text-blue-700' : 'text-gray-500'}`}>
                                        {num === 1 ? 'Classic' : num === 2 ? 'Green' : num === 3 ? 'Modern' : 'Luxe Crystal'}
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

                            <div className='pt-6 border-t mt-4'>
                                <Button
                                    className='w-full bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white shadow-lg font-semibold h-12'
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
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ResumeDialog;
