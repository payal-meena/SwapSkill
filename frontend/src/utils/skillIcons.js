// Skill name to icon/logo mapping
export const getSkillIcon = (skillName) => {
  if (!skillName) return '💡';

  const name = skillName.toLowerCase().trim();

  const skillMap = {
    // Programming Languages
    'javascript': '⚡',
    'typescript': '📘',
    'python': '🐍',
    'java': '☕',
    'c++': '⚙️',
    'c#': '🎮',
    'php': '🐘',
    'ruby': '💎',
    'go': '🎯',
    'rust': '🦀',
    'kotlin': '🟣',
    'swift': '🍎',
    'objective-c': '🍎',
    'r': '📊',

    // Frontend Frameworks
    'react': '⚛️',
    'vue': '💚',
    'angular': '🅰️',
    'svelte': '🔶',
    'next.js': '⬛',
    'nuxt': '🟢',
    'ember': '🔴',

    // Backend & Databases
    'node.js': '🟩',
    'node': '🟩',
    'express': '🚂',
    'django': '🟢',
    'flask': '🍶',
    'spring': '🍃',
    'laravel': '🔴',
    'asp.net': '🔵',
    'mongodb': '🍃',
    'postgresql': '🐘',
    'mysql': '🐬',
    'redis': '🔴',
    'elasticsearch': '🔍',
    'firebase': '⚡',

    // Mobile
    'react native': '📱',
    'flutter': '🎨',
    'xamarin': '⚪',

    // Cloud & DevOps
    'aws': '🟠',
    'azure': '☁️',
    'gcp': '☁️',
    'docker': '🐳',
    'kubernetes': '☸️',
    'jenkins': '👷',
    'github actions': '🔄',
    'gitlab': '🦊',

    // Design & Creative
    'figma': '🎨',
    'adobe xd': '🎨',
    'sketch': '🎨',
    'photoshop': '🖼️',
    'illustrator': '✏️',
    'blender': '🎬',
    'ui design': '🎨',
    'ux design': '👥',
    'web design': '🌐',
    'graphic design': '🖌️',

    // Languages
    'english': '🌎',
    'spanish': '🇪🇸',
    'french': '🇫🇷',
    'german': '🇩🇪',
    'chinese': '🇨🇳',
    'japanese': '🇯🇵',
    'hindi': '🇮🇳',
    'arabic': '🇸🇦',
    'portuguese': '🇵🇹',
    'italian': '🇮🇹',
    'russian': '🇷🇺',
    'korean': '🇰🇷',

    // Other Technologies
    'git': '🌿',
    'linux': '🐧',
    'windows': '🪟',
    'macos': '🍎',
    'html': '🌐',
    'css': '🎨',
    'sql': '🗄️',
    'rest api': '🔌',
    'graphql': '◼️',
    'websocket': '🔌',
    'aws lambda': '⚡',

    // Business & Soft Skills
    'leadership': '👑',
    'management': '📋',
    'communication': '💬',
    'project management': '📊',
    'business analysis': '📈',
    'sales': '💼',
    'marketing': '📢',
    'seo': '🔍',
    'content writing': '✍️',
    'copywriting': '📝',

    // Data & Analytics
    'data science': '📊',
    'machine learning': '🤖',
    'data analysis': '📉',
    'tableau': '📊',
    'power bi': '📊',
    'excel': '📑',

    // Video & Audio
    'video editing': '🎬',
    'audio engineering': '🎧',
    'music production': '🎵',
    'podcasting': '🎙️',

    // Teaching & Content
    'teaching': '🏫',
    'tutoring': '👨‍🏫',
    'training': '🎓',
    'public speaking': '🎤',
    'presentation': '🎯',
  };

  return skillMap[name] || '💡';
};

// Get skill color based on category
export const getSkillColor = (skillName) => {
  const name = skillName.toLowerCase().trim();

  if (['javascript', 'typescript', 'nodejs', 'node.js', 'react', 'vue', 'angular'].includes(name)) {
    return 'text-yellow-500';
  }
  if (['python', 'django', 'flask', 'java', 'c++'].includes(name)) {
    return 'text-blue-500';
  }
  if (['figma', 'adobe xd', 'photoshop', 'ui design', 'ux design'].includes(name)) {
    return 'text-purple-500';
  }
  if (['english', 'spanish', 'french', 'hindi'].includes(name)) {
    return 'text-orange-500';
  }

  return 'text-gray-500';
};
