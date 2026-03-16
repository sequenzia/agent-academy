type Platform = 'github' | 'gitlab';

const REPO_URL =  'https://gitlab.com/sequenzia/agent-academy'
// 'https://github.com/sequenzia/agent-academy';

function derivePlatform(url: string): Platform {
	if (url.includes('gitlab')) return 'gitlab';
	return 'github';
}

const platform = derivePlatform(REPO_URL);

export const repo = {
	url: REPO_URL,
	platform,
	label: platform === 'gitlab' ? 'GitLab' : 'GitHub',
	icon: platform as 'github' | 'gitlab',
} as const;
