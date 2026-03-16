// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { repo } from './src/config/repo.ts';

// https://astro.build/config
export default defineConfig({
	integrations: [
		mermaid({
			autoTheme: true,
		}),
		starlight({
			title: 'Agent Academy',
			favicon: '/favicon.png',
			logo: {
				src: './src/assets/agent-academy.png',
				alt: 'Agent Academy logo',
				replacesTitle: false,
			},
			customCss: ['./src/styles/custom.css'],
			components: {
				Hero: './src/components/Hero.astro',
				SocialIcons: './src/components/SocialIcons.astro',
			},
			description:
				'A structured learning resource for developers working with AI coding agents. Master prompt engineering, context engineering, agent skills, MCP servers, and more.',
			social: [
				{
					icon: repo.icon,
					label: repo.label,
					href: repo.url,
				},
			],
			sidebar: [
				{
					label: 'Module 1: Introduction',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: '01-introduction/overview' },
						{ label: 'The agent loop', slug: '01-introduction/agent-loop' },
						{ label: 'Agent categories', slug: '01-introduction/agent-categories' },
						{ label: 'When to use agents', slug: '01-introduction/when-to-use-agents' },
						{ label: 'The mental model shift', slug: '01-introduction/mental-model-shift' },
					],
				},
				{
					label: 'Module 2: Environment Setup',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: '02-setup/overview' },
						{ label: 'OpenCode setup', slug: '02-setup/opencode-setup' },
						{ label: 'Codex setup', slug: '02-setup/codex-setup' },
						{ label: 'Environment essentials', slug: '02-setup/environment-essentials' },
					],
				},
				{
					label: 'Module 3: Prompt Engineering',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: '03-prompt-engineering/overview' },
						{ label: 'Prompting fundamentals', slug: '03-prompt-engineering/fundamentals' },
						{ label: 'Practical techniques', slug: '03-prompt-engineering/practical-techniques' },
						{ label: 'Common pitfalls', slug: '03-prompt-engineering/common-pitfalls' },
						{ label: 'Agent-specific prompting', slug: '03-prompt-engineering/agent-specific-prompting' },
					],
				},
				{
					label: 'Module 4: Context Engineering',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: '04-context-engineering/overview' },
						{ label: 'What is context engineering?', slug: '04-context-engineering/what-is-context-engineering' },
						{ label: 'Context file formats', slug: '04-context-engineering/context-file-formats' },
						{ label: 'Writing effective context', slug: '04-context-engineering/writing-effective-context' },
						{ label: 'Context hierarchy', slug: '04-context-engineering/context-hierarchy' },
						{ label: 'Practical workshop', slug: '04-context-engineering/practical-workshop' },
					],
				},
				{
					label: 'Module 5: Agent Skills',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: '05-agent-skills/overview' },
						{ label: 'What are agent skills?', slug: '05-agent-skills/what-are-skills' },
						{ label: 'Skill anatomy', slug: '05-agent-skills/skill-anatomy' },
						{ label: 'Using existing skills', slug: '05-agent-skills/using-existing-skills' },
						{ label: 'Creating custom skills', slug: '05-agent-skills/creating-custom-skills' },
						{ label: 'Skill design patterns', slug: '05-agent-skills/design-patterns' },
					],
				},
				{
					label: 'Module 6: MCP Servers',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: '06-mcp-servers/overview' },
						{ label: 'What is MCP?', slug: '06-mcp-servers/what-is-mcp' },
						{ label: 'Discovering and evaluating servers', slug: '06-mcp-servers/discovering-servers' },
						{ label: 'Configuring MCP servers', slug: '06-mcp-servers/configuration' },
						{ label: 'Working with MCP in practice', slug: '06-mcp-servers/practical-usage' },
						{ label: 'Security considerations', slug: '06-mcp-servers/security-considerations' },
					],
				},
				{
					label: 'Module 7: Subagents',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: '07-subagents/overview' },
						{ label: 'What are subagents?', slug: '07-subagents/what-are-subagents' },
						{ label: 'Subagent patterns', slug: '07-subagents/subagent-patterns' },
						{ label: 'Practical workflows', slug: '07-subagents/practical-workflows' },
						{ label: 'Limitations and tradeoffs', slug: '07-subagents/limitations-and-tradeoffs' },
					],
				},
				{
					label: 'Module 8: Security',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: '08-security/overview' },
						{ label: 'Threat model', slug: '08-security/threat-model' },
						{ label: 'Permissions and sandboxing', slug: '08-security/permissions-and-sandboxing' },
						{ label: 'Credential management', slug: '08-security/credential-management' },
						{ label: 'Code review and validation', slug: '08-security/code-review-practices' },
						{ label: 'Operational safety', slug: '08-security/operational-safety' },
					],
				},
			],
		}),
	],
});
