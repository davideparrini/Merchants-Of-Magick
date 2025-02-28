// src/hooks/useSkills.js
import { useState } from 'react';

export function useSkills() {
    const [skillsGained, setSkillsGained] = useState([]);
    const [reportSkills, setReportSkills] = useState([]);

    const addSkill = (skill) => {
        setSkillsGained((prev) => [...prev, skill]);
        setReportSkills((prev) => [...prev, skill]);
    };

    return { skillsGained, addSkill, reportSkills };
}