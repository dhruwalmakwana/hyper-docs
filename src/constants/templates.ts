export const templates = [
  {
    id: "blank",
    label: "Blank Document",
    imageURL: "/blank-document.svg",
    initialContent: "",
  },
  {
    id: "software-proposal",
    label: "Software Development Proposal",
    imageURL: "/software-proposal.svg",
    initialContent: `
        <h1>Software Development Proposal</h1>

        <h2>Project Title</h2>
        <p>Clear and concise title for the software project.</p>

        <h2>Executive Summary</h2>
        <p>Brief overview of the proposed software solution, its purpose, and expected benefits.</p>

        <h2>Project Objectives</h2>
        <ul>
        <li>Objective #1</li>
        <li>Objective #2</li>
        <li>Objective #3</li>
        </ul>

        <h2>Scope of Work</h2>
        <p>Detailed description of the software features, functionalities, and deliverables.</p>

        <h2>Technical Requirements</h2>
        <p>Details of the technology stack, platforms, and system requirements.</p>

        <h2>Architecture and Design</h2>
        <p>High-level system architecture and design approach.</p>

        <h2>Development Methodology</h2>
        <p>Approach for software development (e.g., Agile, Waterfall, Scrum).</p>

        <h2>Timeline and Milestones</h2>
        <p>Estimated timeline with key milestones and deliverables.</p>

        <h2>Budget and Cost Estimation</h2>
        <p>Cost breakdown, including development, testing, deployment, and maintenance.</p>

        <h2>Team and Resources</h2>
        <p>Details of the development team, roles, and other resources required.</p>

        <h2>Risk Management</h2>
        <p>Potential risks, challenges, and mitigation strategies.</p>

        <h2>Maintenance and Support</h2>
        <p>Post-deployment support and maintenance plan.</p>

        <h2>Conclusion and Call to Action</h2>
        <p>Summary of the proposal and a request for approval or next steps.</p>

        `,
  },
  {
    id: "project-proposal",
    label: "Project Proposal",
    imageURL: "/project-proposal.svg",
    initialContent: `
        <h1>Project Proposal</h1>

        <h2>Title of the Project</h2>
        <p>Clear and concise title for the project.</p>

        <h2>Executive Summary</h2>
        <p>Brief overview of the project, including objectives, scope, and expected outcomes.</p>

        <h2>Background and Problem Statement</h2>
        <p>Description of the problem or opportunity that the project addresses.</p>

        <h2>Project Objectives</h2>
        <ul>
        <li>Objective #1</li>
        <li>Objective #2</li>
        <li>Objective #3</li>
        </ul>

        <h2>Scope of Work</h2>
        <p>Detailed description of the tasks, deliverables, and boundaries of the project.</p>

        <h2>Methodology</h2>
        <p>Approach and methods to be used for project execution and problem-solving.</p>

        <h2>Timeline</h2>
        <p>Estimated timeline with key milestones and deadlines.</p>

        <h2>Budget</h2>
        <p>Cost estimates and budget requirements for the project.</p>

        <h2>Resources Required</h2>
        <p>Team members, equipment, tools, and other resources needed for the project.</p>

        <h2>Risk Assessment</h2>
        <p>Potential risks and mitigation strategies.</p>

        <h2>Conclusion and Call to Action</h2>
        <p>Summary of the proposal and request for approval or next steps.</p>

    `,
  },
  {
    id: "business-letter",
    label: "Business Letter",
    imageURL: "/business-letter.svg",
    initialContent: `
        <h1>Business Letter</h1>

        <h2>Sender's Information</h2>
        <p>Name, Address, Phone Number, and Email.</p>

        <h2>Date</h2>
        <p>Date of the letter.</p>

        <h2>Recipient's Information</h2>
        <p>Name, Title, Company, and Address.</p>

        <h2>Salutation</h2>
        <p>Dear [Recipient's Name],</p>

        <h2>Introduction</h2>
        <p>Brief introduction stating the purpose of the letter.</p>

        <h2>Body</h2>
        <p>Detailed information, supporting details, and explanations.</p>

        <h2>Conclusion</h2>
        <p>Summary of the key points and a call to action, if necessary.</p>

        <h2>Closing</h2>
        <p>Sincerely,<br>Your Name<br>Your Title<br>Your Company</p>

    `,
  },
  {
    id: "resume",
    label: "Resume",
    imageURL: "/resume.svg",
    initialContent: `
       <h1>Resume</h1>
        <h2>Personal Information</h2>
        <p>Name, Phone Number, Email, and LinkedIn (optional).</p>

        <h2>Professional Summary</h2>
        <p>Brief overview of your skills, experience, and career goals.</p>

        <h2>Work Experience</h2>
        <h3>Job Title - Company Name</h3>
        <p>Location | Dates of Employment</p>
        <ul>
        <li>Key responsibility or achievement #1</li>
        <li>Key responsibility or achievement #2</li>
        <li>Key responsibility or achievement #3</li>
        </ul>

        <h3>Job Title - Company Name</h3>
        <p>Location | Dates of Employment</p>
        <ul>
        <li>Key responsibility or achievement #1</li>
        <li>Key responsibility or achievement #2</li>
        <li>Key responsibility or achievement #3</li>
        </ul>

        <h2>Education</h2>
        <h3>Degree - Institution Name</h3>
        <p>Location | Graduation Year</p>

        <h2>Skills</h2>
        <ul>
        <li>Skill #1</li>
        <li>Skill #2</li>
        <li>Skill #3</li>
        </ul>

        <h2>Certifications (Optional)</h2>
        <p>Certification Name - Issuing Organization | Year Obtained</p>

        <h2>References (Optional)</h2>
        <p>Available upon request.</p>
        `,
  },
  {
    id: "cover-letter",
    label: "Cover Letter",
    imageURL: "/cover-letter.svg",
    initialContent: `
        <h1>Cover Letter</h1>

        <h2>Sender's Information</h2>
        <p>Name, Address, Phone Number, and Email.</p>

        <h2>Date</h2>
        <p>Date of the letter.</p>

        <h2>Recipient's Information</h2>
        <p>Name, Title, Company, and Address.</p>

        <h2>Salutation</h2>
        <p>Dear [Recipient's Name],</p>

        <h2>Introduction</h2>
        <p>State the position you are applying for and how you found out about the opportunity. Briefly mention why you are interested in the role.</p>

        <h2>Body Paragraph 1</h2>
        <p>Highlight your relevant experience, skills, and qualifications. Explain how your background makes you a good fit for the position.</p>

        <h2>Body Paragraph 2</h2>
        <p>Provide examples of your achievements and how they relate to the job requirements. Demonstrate your knowledge of the company and how you can contribute to its goals.</p>

        <h2>Conclusion</h2>
        <p>Reaffirm your interest in the position and your enthusiasm for contributing to the company. Mention that you have attached your resume and are available for an interview at the employer's convenience.</p>

        <h2>Closing</h2>
        <p>Sincerely,<br>Your Name</p>

    `,
  },
  {
    id: "letter",
    label: "Letter",
    imageURL: "/letter.svg",
    initialContent: `
        <h1>Letter</h1>

        <h2>Sender's Information</h2>
        <p>Name, Address, Phone Number, and Email.</p>

        <h2>Date</h2>
        <p>Date of the letter.</p>

        <h2>Recipient's Information</h2>
        <p>Name, Title (if applicable), Company (if applicable), and Address.</p>

        <h2>Salutation</h2>
        <p>Dear [Recipient's Name],</p>

        <h2>Introduction</h2>
        <p>Begin with a brief introduction stating the purpose of the letter.</p>

        <h2>Body Paragraph 1</h2>
        <p>Provide details and context related to the purpose of the letter.</p>

        <h2>Body Paragraph 2</h2>
        <p>Include any additional information ,explanations, or requests.</p>

        <h2>Conclusion</h2>
        <p>Summarize the key points and clearly sttae any actions needed or expected responses.</p>

        <h2>Closing</h2>
        <p>Sincerely,<br>Your Name</p>

    `,
  },
];
