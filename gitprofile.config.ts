// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'nmamie', // Your GitHub org/user name. (This is the only required config)
  },
  /**
   * If you are deploying to https://<USERNAME>.github.io/, for example your repository is at https://github.com/arifszn/arifszn.github.io, set base to '/'.
   * If you are deploying to https://<USERNAME>.github.io/<REPO_NAME>/,
   * for example your repository is at https://github.com/arifszn/portfolio, then set base to '/portfolio/'.
   */
  base: '/',
  projects: {
    github: {
      display: true, // Display GitHub projects?
      header: 'Github Projects',
      mode: 'automatic', // Mode can be: 'automatic' or 'manual'
      automatic: {
        sortBy: 'stars', // Sort projects by 'stars' or 'updated'
        limit: 6, // How many projects to display.
        exclude: {
          forks: true, // Forked projects will not be displayed if set to true.
          projects: [], // These projects will not be displayed. example: ['arifszn/my-project1', 'arifszn/my-project2']
        },
      },
      manual: {
        // Properties for manually specifying projects
        projects: ['nmamie/HiveLLM', 'nmamie/RLatari'], // List of repository names to display. example: ['arifszn/my-project1', 'arifszn/my-project2']
      },
    },
    external: {
      header: 'My Projects',
      // To hide the `External Projects` section, keep it empty.
      projects: [],
    },
  },
  seo: { title: 'Noah Mamie', description: 'PhD @ UZH | Artificial Intelligence | GenAI, Multi-Agent Systems, GNNs', imageURL: 'public/logo.png' },
  social: {
    linkedin: 'noah-mamie',
    x: '',
    mastodon: '',
    researchGate: '',
    facebook: '',
    instagram: '',
    reddit: '',
    threads: '',
    youtube: '', // example: 'pewdiepie'
    udemy: '',
    dribbble: '',
    behance: '',
    medium: 'nmamie',
    dev: '',
    stackoverflow: '', // example: '1/jeff-atwood'
    discord: '',
    telegram: '',
    scholar: 'https://scholar.google.com/citations?user=JhXjm_sAAAAJ&hl=de',
    scholarName: 'Noah Mamié',
    phone: '',
    email: 'noah.mamie@uzh.ch',
  },
  resume: {
    fileUrl:
      '', // Empty fileUrl will hide the `Download Resume` button.
  },
  skills: [
    'Python',
    'PyTorch',
    'C/C++',
    'Java',
    'JavaScript',
    'React.js',
    'Node.js',
    'Nest.js',
    'MySQL',
    'PostgreSQL',
    'Git',
    'Docker',
    'CSS',
  ],
  experiences: [
    {
      company: 'University of Zurich',
      position: 'Doctoral Researcher',
      from: 'September 2025',
      to: 'Present',
      companyLink: 'https://www.ifi.uzh.ch',
    },
    {
      company: 'Detecon Switzerland',
      position: 'Generative AI Intern',
      from: 'April 2025',
      to: 'August 2025',
      companyLink: 'https://www.detecon.com',
    },
  ],
  certifications: [
    {
      name: 'Bloomberg Market Concepts',
      body: 'Bloomberg',
      year: 'Jan 2021',
      link: 'Credential ID 160629711743',
    },
    {
      name: 'Harvard CS50',
      body: 'CS50x: Introduction to the Intellectual Enterprises of Computer Science and the Art of Programming',
      year: 'Dec 2020',
      link: 'https://certificates.cs50.io/d585320d-bb6f-48e6-86f6-93ac9602c8d2.pdf?size=letter',
    },
  ],
  educations: [
    {
      institution: 'University of Zurich',
      degree: 'PhD in Artificial Intelligence',
      from: '2025',
      to: 'Present',
    },
    {
      institution: 'University of Zurich',
      degree: 'MSc in Artificial Intelligence',
      from: '2022',
      to: '2024',
    },
    {
      institution: 'University of St. Gallen',
      degree: 'BA in Business Administration',
      from: '2017',
      to: '2021',
    },
  ],
  publications: [
    {
      title: 'The Society of HiveMind: Multi-Agent Optimization of Foundation Model Swarms to Unlock the Potential of Collective Intelligencee',
      conferenceName: 'The Sixteenth International Conference on Swarm Intelligence 2025',
      journalName: '',
      authors: 'Noah Mamie and Susie Xi Rao',
      link: 'https://arxiv.org/pdf/2503.05473?',
      description:
        'We introduce the Society of HiveMind (SOHM), a framework that coordinates multiple AI foundation models inspired by swarm behavior and evolutionary theory. While SOHM shows little gain on knowledge-intensive tasks, it significantly boosts performance on logical reasoning tasks, highlighting the potential of multi-agent systems to enhance collective reasoning beyond individual models.',
      year: '2025',
    },
    {
      title: 'Voting Booklet Bias: Stance Detection in Swiss Federal Communication',
      conferenceName: 'SwissText Analytics Conference 2023',
      journalName: '',
      authors: 'Eric Egli, Noah Mamie, Mathias Müller and Eyal Liron Dolev',
      link: 'https://arxiv.org/pdf/2306.08999',
      description:
        'We apply stance detection to Swiss federal voting booklets to examine whether issues are presented neutrally. After comparing models, we find fine-tuned M-BERT performs best and use it to analyze the September 2022 votes in German, French, and Italian. Results show certain issues are strongly favored while others remain balanced, with consistent patterns across languages.',
      year: '2023',
    },
  ],
  news: [
    {
      title: 'Starting PhD at University of Zurich!',
      date: 'September 2025',
      description: 'I am excited to start my PhD journey at the University of Zurich, focusing on Multi-Agent Systems and Foundation Models.',
    },
    {
      title: 'New paper on arXiv: The Society of HiveMind',
      date: 'March 2025',
      link: 'https://arxiv.org/abs/2503.05473',
      description: 'Our latest research on foundation model swarms is now available on arXiv.',
    },
  ],
  // Display articles from your medium or dev account. (Optional)
  blog: {
    source: 'medium', // medium | dev
    username: 'nmamie', // to hide blog section, keep it empty
    limit: 4, // How many articles to display. Max is 10.
  },
  googleAnalytics: {
    id: 'G-3JXZKGPXQ1', // GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
  },
  // Track visitor interaction and behavior. https://www.hotjar.com
  hotjar: { id: '', snippetVersion: 6 },
  themeConfig: {
    defaultTheme: 'winter',

    // Hides the switch in the navbar
    // Useful if you want to support a single color mode
    disableSwitch: false,

    // Should use the prefers-color-scheme media-query,
    // using user system preferences, instead of the hardcoded defaultTheme
    respectPrefersColorScheme: false,

    // Display the ring in Profile picture
    displayAvatarRing: true,

    // Available themes. To remove any theme, exclude from here.
    themes: [
      'light',
      'dark',
      'cupcake',
      'bumblebee',
      'emerald',
      'corporate',
      'synthwave',
      'retro',
      'cyberpunk',
      'valentine',
      'halloween',
      'garden',
      'forest',
      'aqua',
      'lofi',
      'pastel',
      'fantasy',
      'wireframe',
      'black',
      'luxury',
      'dracula',
      'cmyk',
      'autumn',
      'business',
      'acid',
      'lemonade',
      'night',
      'coffee',
      'winter',
      'dim',
      'nord',
      'sunset',
      'caramellatte',
      'abyss',
      'silk',
      'procyon',
    ],
  },

  // Optional Footer. Supports plain text or HTML.
  footer: `Made with ❤️ in Switzerland. © Copyright 2026 Noah Mamié.`,

  enablePWA: true,
};

export default CONFIG;
