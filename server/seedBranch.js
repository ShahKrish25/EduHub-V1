const mongoose = require("mongoose");
const Branch = require("./models/Branch");

const MONGO_URI = "mongodb+srv://studyhub_user:StudyHub123@cluster0.j9nvm9u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function seed() {
  await mongoose.connect(MONGO_URI);

  // IT Branch - Complete curriculum based on provided data
  const itSem1And2Subjects = [
    { name: "Basic Electrical Engineering" },
    { name: "Environmental Science" },
    { name: "Engineering Graphics & Design" },
    { name: "Mathematics – 1" },
    { name: "Programming for Problem Solving" },
    { name: "Basic Mechanical Engineering" },
    { name: "Mathematics – 2" },
    { name: "Basic Electronics" },
    { name: "Physics" },
    { name: "English" }
  ];

  const itSem3Subjects = [
    { name: "Effective Technical Communication" },
    { name: "Probability and Statistics" },
    { name: "Indian Constitution" },
    { name: "Design Engineering 1 A" },
    { name: "Data Structures" },
    { name: "Database Management Systems" },
    { name: "Digital Fundamentals" }
  ];

  const itSem4Subjects = [
    { name: "Operating System and Virtualization" },
    { name: "Object-Oriented Programming -I" },
    { name: "Computer Organization & Architecture" },
    { name: "Discrete Mathematics" },
    { name: "Principles of Economics and Management" },
    { name: "Design Engineering 1 B" }
  ];

  const itSem5Subjects = [
    { name: "Contributor Personality Development Program (CPDP)" },
    { name: "Integrated Personality Development Course (IPDC)" },
    { name: "Analysis and Design of Algorithms" },
    { name: "Professional Ethics" },
    { name: "Computer Networks" },
    { name: "Software Engineering" },
    { name: "Computer Graphics" },
    { name: "Python for Data Science" },
    { name: "Cyber Security" },
    { name: "Object Oriented Analysis and Design" },
    { name: "Formal Language and Automata Theory" },
    { name: "Web Development" },
    { name: "Computer Graphics and Visualization" },
    { name: "Data Science" },
    { name: "Design Engineering 2 A" }
  ];

  const itSem6Subjects = [
    { name: "Contributor Personality Development Program (CPDP)" },
    { name: "Integrated Personality Development Course (IPDC -2)" },
    { name: "Image Processing" },
    { name: "Software Engineering" },
    { name: "Cryptography and Network Security" },
    { name: "Big Data Analytics" },
    { name: "Artificial Intelligence" },
    { name: "Enterprise Application Development" },
    { name: "Data Warehousing and Mining" },
    { name: "Advanced Web Programming" },
    { name: "Mobile Application Development" },
    { name: "Data Analysis and Visualization" },
    { name: "Design Engineering 2 B" }
  ];

  const itSem7Subjects = [
    { name: "Summer Internship" },
    { name: "Information Retrieval" },
    { name: "Internet of things" },
    { name: "Wireless Communication" },
    { name: "Software Project Management" },
    { name: "Agile Development and UI/UX design" },
    { name: "Graph Theory and Combinatorics" },
    { name: "Virtual and Augment Reality" },
    { name: "Pattern Recognition" },
    { name: "Computer Vision" },
    { name: "Data Compression" },
    { name: "Internetwork Security and Web Analytics" },
    { name: "Applied Machine Learning" },
    { name: "Blockchain" }
  ];

  const itSem8Subjects = [
    { name: "Internship/Project" }
  ];

  // Computer Branch - Complete curriculum based on provided data
  const computerSem1And2Subjects = [
    { name: "Basic Electrical Engineering" },
    { name: "Environmental Science" },
    { name: "Engineering Graphics & Design" },
    { name: "Mathematics – 1" },
    { name: "Programming for Problem Solving" },
    { name: "Basic Mechanical Engineering" },
    { name: "Mathematics – 2" },
    { name: "Basic Electronics" },
    { name: "Physics" },
    { name: "English" }
  ];

  const computerSem3Subjects = [
    { name: "Effective Technical Communication" },
    { name: "Probability and Statistics" },
    { name: "Indian Constitution" },
    { name: "Design Engineering 1 A" },
    { name: "Data Structures" },
    { name: "Database Management Systems" },
    { name: "Digital Fundamentals" }
  ];

  const computerSem4Subjects = [
    { name: "Operating System" },
    { name: "Object-Oriented Programming -I" },
    { name: "Computer Organization & Architecture" },
    { name: "Discrete Mathematics" },
    { name: "Principles of Economics and Management" }
  ];

  const computerSem5Subjects = [
    { name: "Contributor Personality Development Program" },
    { name: "Integrated Personality Development Course" },
    { name: "Analysis and Design of Algorithms" },
    { name: "Professional Ethics" },
    { name: "Computer Networks" },
    { name: "Software Engineering" },
    { name: "Computer Graphics" },
    { name: "Python for Data Science" },
    { name: "Cyber Security" }
  ];

  const computerSem6Subjects = [
    { name: "Contributor Personality Development Program" },
    { name: "Integrated Personality Development Course" },
    { name: "Theory of Computation" },
    { name: "Advanced Java Programming" },
    { name: "Microprocessor and Interfacing" },
    { name: "Web Programming" },
    { name: "Data Mining" },
    { name: "System Software" },
    { name: "IOT and applications" },
    { name: "Data Visualization" }
  ];

  const computerSem7Subjects = [
    { name: "Summer Internship" },
    { name: "Compiler Design" },
    { name: "Mobile Computing & Wireless Communication" },
    { name: "Artificial Intelligence" },
    { name: "Cloud Computing" },
    { name: "Information Retrieval" },
    { name: "Distributed System" },
    { name: "Information Security" },
    { name: "Parallel and Distributed Computing" },
    { name: "Big Data Analytics" },
    { name: "Natural Language Processing" },
    { name: "Machine Learning" },
    { name: "Digital Forensics" },
    { name: "Mobile Application Development" }
  ];

  const computerSem8Subjects = [
    { name: "Internship" }
  ];

  // Mechanical Branch - Complete curriculum based on provided data
  const mechanicalSem1And2Subjects = [
    { name: "Basic Electrical Engineering" },
    { name: "Environmental Science" },
    { name: "Engineering Graphics & Design" },
    { name: "Mathematics – 1" },
    { name: "Programming for Problem Solving" },
    { name: "Basic Mechanical Engineering" },
    { name: "Mathematics – 2" },
    { name: "Basic Electronics" },
    { name: "Physics" },
    { name: "Basic Civil Engineering" },
    { name: "English" }
  ];

  const mechanicalSem3Subjects = [
    { name: "Material Science and Metallurgy" },
    { name: "Engineering Thermodynamics" },
    { name: "Kinematics and Theory of Machines" },
    { name: "Effective Technical Communication" },
    { name: "Complex Variables and Partial Differential Equations" },
    { name: "Indian Constitution" },
    { name: "Design Engineering 1 A" }
  ];

  const mechanicalSem4Subjects = [
    { name: "Mechanical Measurement and Metrology" },
    { name: "Fluid Mechanics and Hydraulics Machines" },
    { name: "Fundamentals of Machine Design" },
    { name: "Manufacturing Processes" },
    { name: "Organisational Behaviour" },
    { name: "Design Engineering 1 B" }
  ];

  const mechanicalSem5Subjects = [
    { name: "Contributor Personality Development Program (CPDP)" },
    { name: "Integrated Personality Development Course (IPDC)" },
    { name: "Control Engineering" },
    { name: "Heat Transfer" },
    { name: "Operation Research" },
    { name: "Dynamics of Machinery" },
    { name: "Manufacturing Technology" },
    { name: "Oil Hydraulics And Pneumatics" },
    { name: "Design Engineering 2 A" }
  ];

  const mechanicalSem6Subjects = [
    { name: "Contributor Personality Development Program (CPDP)" },
    { name: "Integrated Personality Development Course (IPDC -2)" },
    { name: "Computer Aided Design" },
    { name: "Basics of Industrial Engineering" },
    { name: "Applied Thermodynamics" },
    { name: "Design of Heat exchangers" },
    { name: "Gas Dynamics" },
    { name: "Industrial Safety and Maintenance Engineering" },
    { name: "Renewable Energy Engineering" },
    { name: "Computational Fluid Dynamics" },
    { name: "Product Development and Entrepreneurship" },
    { name: "Computer Aided Manufacturing" },
    { name: "Tribology and Terotechnology" },
    { name: "Energy Conservation and Management" },
    { name: "Automobile Engineering" },
    { name: "Machine Tool Design" },
    { name: "Advanced Manufacturing Processes" },
    { name: "Non destructive Testing" },
    { name: "Entrepreneurship and E-business" },
    { name: "Cyber Laws and Ethics" },
    { name: "Industry 4.0" },
    { name: "Design Engineering 2 B" }
  ];

  const mechanicalSem7Subjects = [
    { name: "Power plant Engineering" },
    { name: "Advanced Heat Transfer" },
    { name: "Design of Machine elements" },
    { name: "Refrigeration and Air conditioning" },
    { name: "Cryogenics Engineering" },
    { name: "Finite Element Methods" },
    { name: "Metal forming analysis" },
    { name: "Automation in Manufacturing" },
    { name: "Internal Combustion Engine" },
    { name: "Principles of Combustion" },
    { name: "Advanced Machine Design" },
    { name: "Rapid Prototyping" },
    { name: "Turbo Machines" },
    { name: "Design of Material Handling Equipment" },
    { name: "Quality and Reliability Engineering" },
    { name: "Industrial Internet of Things" },
    { name: "Nanotechnology and surface Engineering" },
    { name: "Project Management" },
    { name: "Summer Internship" }
  ];

  const mechanicalSem8Subjects = [
    { name: "Internship/Project" }
  ];

  // Civil branch subjects (keeping the existing ones)
  const civilSem1Subjects = [
    { name: "Programming for Problem Solving" },
    { name: "Basic Mechanical Engineering" },
    { name: "Environmental Science" },
    { name: "Physics Group - I" },
    { name: "Mathematics-I" },
    { name: "Basic Electrical Engineering" },
    { name: "Engineering Graphics & Design" },
    { name: "Mathematics-II" }
  ];

  const civilSem3Subjects = [
    { name: "Effective Technical Communication" },
    { name: "Indian Constitution" },
    { name: "Geotechnical Engineering" },
    { name: "Building Constructiuon Technology" },
    { name: "Mechanics Of Solids" },
    { name: "Building and Town Planning" }
  ];

  const civilSem4Subjects = [
    { name: "SURVEYING" },
    { name: "Structural Analysis - I" },
    { name: "Civil Engineering - Societal & Global Impact" },
    { name: "Complex Variables and Partial Differential Equations" },
    { name: "Fluid Mechanics & Hydraulics" }
  ];

  const civilSem5Subjects = [
    { name: "TRANSPORTATION ENGINEERING" },
    { name: "DESIGN OF STRUCTURES" },
    { name: "PAVEMENT DESIGN AND HIGHWAY CONSTRUCTION" }
  ];

  const civilSem6Subjects = [
    { name: "Advanced Construction And Equipments" },
    { name: "Applied Fluid Mechanics" },
    { name: "Railway, Bridge And Tunnel Engineering" },
    { name: "Water & Waste Water Engineering" },
    { name: "Elementary Structural Design" },
    { name: "Urban Transportation System" }
  ];

  const civilSem7Subjects = [
    { name: "Design of Reinforced Concrete Structures" },
    { name: "Irrigation Engineering" },
    { name: "Professional Practices & Valuation" },
    { name: "Traffic Engineering" }
  ];

  const civilSem8Subjects = [
    { name: "Harbour & Airport Engineering" },
    { name: "Foundation Engineering" },
    { name: "Design of Steel Structures" },
    { name: "Construction Management" }
  ];

  // Electrical Branch - Complete curriculum based on provided data
  const electricalSem1And2Subjects = [
    { name: "Basic Electrical Engineering" },
    { name: "Environmental Science" },
    { name: "Engineering Graphics & Design" },
    { name: "Mathematics – 1" },
    { name: "Programming for Problem Solving" },
    { name: "Basic Mechanical Engineering" },
    { name: "Mathematics – 2" },
    { name: "Basic Electronics" },
    { name: "Physics" },
    { name: "Basic Civil Engineering" },
    { name: "English" }
  ];

  const electricalSem3Subjects = [
    { name: "Control System Theory" },
    { name: "Electrical Circuit Analysis" },
    { name: "Analog & Digital Electronics" },
    { name: "Applied Mathematics for Electrical Engineering" },
    { name: "Effective Technical Communication" },
    { name: "Indian Constitution" },
    { name: "Design Engineering 1 A" }
  ];

  const electricalSem4Subjects = [
    { name: "Economics for Engineers" },
    { name: "Electromagnetic Fields" },
    { name: "Electrical Machine- I" },
    { name: "Power System- I" },
    { name: "Power Electronics" },
    { name: "Design Engineering 1 B" }
  ];

  const electricalSem5Subjects = [
    { name: "Contributor Personality Development Program (CPDP)" },
    { name: "Integrated Personality Development Course (IPDC)" },
    { name: "Electrical Machine- II" },
    { name: "Power System- II" },
    { name: "Signals and Systems" },
    { name: "Disaster Management" },
    { name: "Python Programming" },
    { name: "Operation Research" },
    { name: "Professional Ethics" },
    { name: "Design Engineering 2 A" }
  ];

  const electricalSem6Subjects = [
    { name: "Contributor Personality Development Program (CPDP)" },
    { name: "Integrated Personality Development Course (IPDC -2)" },
    { name: "Microprocessors and Microcontrollers" },
    { name: "Electrical Measurement and Measuring Instruments" },
    { name: "Energy Conservation" },
    { name: "Wind And Solar Energy" },
    { name: "Element of Electrical Design" },
    { name: "Electric Drives" },
    { name: "Inter Connected Power System" },
    { name: "HVDC Transmission Systems" },
    { name: "Object Oriented Programming" },
    { name: "Electrical Materials" },
    { name: "Cyber Laws and Ethics" },
    { name: "Design Engineering 2 B" }
  ];

  const electricalSem7Subjects = [
    { name: "Advanced Power Electronics" },
    { name: "Switchgear And Protection" },
    { name: "AC Machine Design" },
    { name: "Advanced Microcontrollers" },
    { name: "Power System Dynamics and Control" },
    { name: "Advanced Electric Drives" },
    { name: "High Voltage Engineering" },
    { name: "Digital Signal Processors" },
    { name: "Power System Operation and Control" },
    { name: "Industrial Electrical Systems" },
    { name: "Power Quality and FACTS" },
    { name: "Smart Grids" },
    { name: "Electrical and Hybrid Vehicle" },
    { name: "AI and Machine Learning" },
    { name: "Industrial Automation" },
    { name: "Internet Of Things" },
    { name: "Summer Internship" }
  ];

  const electricalSem8Subjects = [
    { name: "Internship" }
  ];

  // Chemical Branch - Complete curriculum based on provided data
  const chemicalSem1And2Subjects = [
    { name: "Basic Electrical Engineering" },
    { name: "Environmental Science" },
    { name: "Engineering Graphics & Design" },
    { name: "Mathematics – 1" },
    { name: "Programming for Problem Solving" },
    { name: "Basic Mechanical Engineering" },
    { name: "Mathematics – 2" },
    { name: "Basic Electronics" },
    { name: "Physics" },
    { name: "Basic Civil Engineering" },
    { name: "English" },
    { name: "Chemistry" },
    { name: "Workshop/ Manufacturing Practices" }
  ];

  const chemicalSem3Subjects = [
    { name: "Fluid Flow Operations" },
    { name: "Applied Chemistry" },
    { name: "Chemical Engineering Thermodynamics I" },
    { name: "Effective Technical Communication" },
    { name: "Material & Energy Balance Computation" },
    { name: "Indian Constitution" },
    { name: "Design Engineering 1 A" }
  ];

  const chemicalSem4Subjects = [
    { name: "Heat Transfer" },
    { name: "Chemical Engineering Thermodynamics II" },
    { name: "Unit Processes & Chemical Technology" },
    { name: "Pollution control & safety Management" },
    { name: "Numerical Methods in Chemical Engineering" },
    { name: "Design Engineering 1 B" }
  ];

  const chemicalSem5Subjects = [
    { name: "Contributor Personality Development Program (CPDP)" },
    { name: "Integrated Personality Development Course (IPDC)" },
    { name: "Mass Transfer Operations I" },
    { name: "Mechanical Operations" },
    { name: "Instrumentation and Process Control" },
    { name: "Particle and Fluid Particle Processing" },
    { name: "Chemical Process Plant Design & Economics" },
    { name: "Energy Technology" },
    { name: "Material Science and Engineering" },
    { name: "Fuels and Combustion" },
    { name: "Design Engineering 2 A" }
  ];

  const chemicalSem6Subjects = [
    { name: "Contributor Personality Development Program (CPDP)" },
    { name: "Integrated Personality Development Course (IPDC -2)" },
    { name: "Mass Transfer Operations II" },
    { name: "Chemical Reactions Engineering I" },
    { name: "Advanced Separation Processes" },
    { name: "Petroleum Refining and Petrochemicals" },
    { name: "Polymer Science and Technology" },
    { name: "Biochemical Engineering" },
    { name: "Waste Water Engineering" },
    { name: "Green Technology and sustainable Development" },
    { name: "Solid waste Management" },
    { name: "Design Engineering 2 B" }
  ];

  const chemicalSem7Subjects = [
    { name: "Chemical Reactions Engineering II" },
    { name: "Process Equipment Design" },
    { name: "Computer Aided Process Synthesis" },
    { name: "Nanoscience and Technology" },
    { name: "Process Intensification" },
    { name: "Transport Phenomena" },
    { name: "Introduction to Computational Fluid Dynamics" },
    { name: "Process Modelling, Simulation and Optimization" },
    { name: "Mechanical Design of Process equipments" },
    { name: "Piping Design" },
    { name: "Process Auxiliaries and utilities" },
    { name: "Summer Internship" }
  ];

  const chemicalSem8Subjects = [
    { name: "Internship" }
  ];

  const aimlSem1And2Subjects = [
    { name: "Basic Electrical Engineering" },
    { name: "Environmental Science" },
    { name: "Engineering Graphics & Design" },
    { name: "Mathematics – 1" },
    { name: "Programming for Problem Solving" },
    { name: "Basic Mechanical Engineering" },
    { name: "Mathematics – 2" },
    { name: "Basic Electronics" },
    { name: "Physics" },
    { name: "English" }
  ];

  const aimlSem3Subjects = [
    { name: "Effective Technical Communication" },
    { name: "Probability and Statistics" },
    { name: "Indian Constitution" },
    { name: "Design Engineering - I A" },
    { name: "Database Management System" },
    { name: "Digital Fundamentals" },
    { name: "Data Structures and Algorithms" }
  ];

  const aimlSem4Subjects = [
    { name: "Design Engineering 1 B" },
    { name: "Operating System" },
    { name: "Object Oriented Programming -I" },
    { name: "Data Communication and Computer Networks" },
    { name: "Discrete Mathematics and Graph Theory" },
    { name: "Introduction of Artificial Intelligence" }
  ];

  const aimlSem5Subjects = [
    { name: "Design Engineering - II A" },
    { name: "Contributor Personality Development Program" },
    { name: "Integrated Personality Development Course" },
    { name: "Optimization Techniques" },
    { name: "Agile Software Development & Devops" },
    { name: "Machine Learning using Python" },
    { name: "Computation Theory" },
    { name: "Image Processing" },
    { name: "Virtual Reality and Immersive Technology" }
  ];

  const aimlSem6Subjects = [
    { name: "Design Engineering II B" },
    { name: "Contributor Personality Development Program" },
    { name: "Integrated Personality Development Course" },
    { name: "Advanced Java Programming" },
    { name: "Theory of Computation" },
    { name: "Data Security" },
    { name: "Predictive Analytics" },
    { name: "Internet of Things" },
    { name: "Nature Inspired Optimization Algorithms" },
    { name: "Fundamentals of Neural Networks" },
    { name: "Data Visualization" }
  ];

  const aimlSem7Subjects = [
    { name: "Cloud Computing" },
    { name: "Deep Learning: Principles and Practices" },
    { name: "Natural Language Processing" },
    { name: "Computer Vision" },
    { name: "Big Data Analytics" },
    { name: "Social and Information Network Analysis" },
    { name: "Enterprise Resource Planning" },
    { name: "Advanced Machine Learning" },
    { name: "Exploratory Data Analysis" },
    { name: "Block Chain Technology" }
  ];

  const aimlSem8Subjects = [
    { name: "Internship" }
  ];

  const branches = [
    {
      name: "IT",
      semesters: [
        { number: 1, subjects: itSem1And2Subjects },
        { number: 2, subjects: itSem1And2Subjects },
        { number: 3, subjects: itSem3Subjects },
        { number: 4, subjects: itSem4Subjects },
        { number: 5, subjects: itSem5Subjects },
        { number: 6, subjects: itSem6Subjects },
        { number: 7, subjects: itSem7Subjects },
        { number: 8, subjects: itSem8Subjects }
      ]
    },
    {
      name: "Computer",
      semesters: [
        { number: 1, subjects: computerSem1And2Subjects },
        { number: 2, subjects: computerSem1And2Subjects },
        { number: 3, subjects: computerSem3Subjects },
        { number: 4, subjects: computerSem4Subjects },
        { number: 5, subjects: computerSem5Subjects },
        { number: 6, subjects: computerSem6Subjects },
        { number: 7, subjects: computerSem7Subjects },
        { number: 8, subjects: computerSem8Subjects }
      ]
    },
    {
      name: "Mechanical",
      semesters: [
        { number: 1, subjects: mechanicalSem1And2Subjects },
        { number: 2, subjects: mechanicalSem1And2Subjects },
        { number: 3, subjects: mechanicalSem3Subjects },
        { number: 4, subjects: mechanicalSem4Subjects },
        { number: 5, subjects: mechanicalSem5Subjects },
        { number: 6, subjects: mechanicalSem6Subjects },
        { number: 7, subjects: mechanicalSem7Subjects },
        { number: 8, subjects: mechanicalSem8Subjects }
      ]
    },
    {
      name: "Civil",
      semesters: [
        { number: 1, subjects: civilSem1Subjects },
        { number: 2, subjects: civilSem1Subjects },
        { number: 3, subjects: civilSem3Subjects },
        { number: 4, subjects: civilSem4Subjects },
        { number: 5, subjects: civilSem5Subjects },
        { number: 6, subjects: civilSem6Subjects },
        { number: 7, subjects: civilSem7Subjects },
        { number: 8, subjects: civilSem8Subjects }
      ]
    },
    {
      name: "Electrical",
      semesters: [
        { number: 1, subjects: electricalSem1And2Subjects },
        { number: 2, subjects: electricalSem1And2Subjects },
        { number: 3, subjects: electricalSem3Subjects },
        { number: 4, subjects: electricalSem4Subjects },
        { number: 5, subjects: electricalSem5Subjects },
        { number: 6, subjects: electricalSem6Subjects },
        { number: 7, subjects: electricalSem7Subjects },
        { number: 8, subjects: electricalSem8Subjects }
      ]
    },
    {
      name: "Chemical",
      semesters: [
        { number: 1, subjects: chemicalSem1And2Subjects },
        { number: 2, subjects: chemicalSem1And2Subjects },
        { number: 3, subjects: chemicalSem3Subjects },
        { number: 4, subjects: chemicalSem4Subjects },
        { number: 5, subjects: chemicalSem5Subjects },
        { number: 6, subjects: chemicalSem6Subjects },
        { number: 7, subjects: chemicalSem7Subjects },
        { number: 8, subjects: chemicalSem8Subjects }
      ]
    },
    {
      name: "AIML",
      semesters: [
        { number: 1, subjects: aimlSem1And2Subjects },
        { number: 2, subjects: aimlSem1And2Subjects },
        { number: 3, subjects: aimlSem3Subjects },
        { number: 4, subjects: aimlSem4Subjects },
        { number: 5, subjects: aimlSem5Subjects },
        { number: 6, subjects: aimlSem6Subjects },
        { number: 7, subjects: aimlSem7Subjects },
        { number: 8, subjects: aimlSem8Subjects }
      ]
    }
  ];

  await Branch.deleteMany({});
  await Branch.insertMany(branches);

  console.log("Branches seeded successfully!");
  console.log(`IT Branch: 8 semesters with ${itSem1And2Subjects.length + itSem3Subjects.length + itSem4Subjects.length + itSem5Subjects.length + itSem6Subjects.length + itSem7Subjects.length + itSem8Subjects.length} total subjects`);
  console.log(`Computer Branch: 8 semesters with ${computerSem1And2Subjects.length + computerSem3Subjects.length + computerSem4Subjects.length + computerSem5Subjects.length + computerSem6Subjects.length + computerSem7Subjects.length + computerSem8Subjects.length} total subjects`);
  console.log(`Mechanical Branch: 8 semesters with ${mechanicalSem1And2Subjects.length + mechanicalSem3Subjects.length + mechanicalSem4Subjects.length + mechanicalSem5Subjects.length + mechanicalSem6Subjects.length + mechanicalSem7Subjects.length + mechanicalSem8Subjects.length} total subjects`);
  console.log(`Civil Branch: 8 semesters maintained`);
  console.log(`Electrical Branch: 8 semesters with ${electricalSem1And2Subjects.length + electricalSem3Subjects.length + electricalSem4Subjects.length + electricalSem5Subjects.length + electricalSem6Subjects.length + electricalSem7Subjects.length + electricalSem8Subjects.length} total subjects`);
  console.log(`Chemical Branch: 8 semesters with ${chemicalSem1And2Subjects.length + chemicalSem3Subjects.length + chemicalSem4Subjects.length + chemicalSem5Subjects.length + chemicalSem6Subjects.length + chemicalSem7Subjects.length + chemicalSem8Subjects.length} total subjects`);
  console.log(`AIML Branch: 8 semesters with ${aimlSem1And2Subjects.length + aimlSem3Subjects.length + aimlSem4Subjects.length + aimlSem5Subjects.length + aimlSem6Subjects.length + aimlSem7Subjects.length + aimlSem8Subjects.length} total subjects`);
  
  mongoose.disconnect();
}

seed().catch(console.error);