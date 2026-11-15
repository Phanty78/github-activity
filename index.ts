interface Activity {
	type: string;
	name: string;
}

interface GitHubAPIResponse {
	id: string;
	type: string;
	actor: GithubAPIResponseActor;
	repo: GithubAPIResponseRepo;
	payload: Object;
	public: boolean;
	created_at: string;
}

interface GithubAPIResponseActor {
	id: number;
	login: string;
	display_login: string;
	gravatar_id: string;
	url: string;
	avatar_url: string;
}

interface GithubAPIResponseRepo {
	id: number;
	name: string;
	url: string;
}

function handleHTTPErrorcode(status: number): void {
	switch (status) {
		case 404:
			console.log("This user doesn't exist.");
			break;
		case 403:
			console.log("Forbidden.");
			break;
		case 500:
			console.log("Internal Server Error.");
			break;
		case 503:
			console.log("Service unavailable.");
			break;
		default:
			console.log("Unknown error appear.");
			break;
	}
}

function displayGitHubData(data: Array<Activity>): void {
	for (const element of data) {
		if (element.type === "PushEvent") {
			console.log(`- Pushed some code in ${element.name}`);
		}
		if (element.type === "PublicEvent") {
			console.log(`- The repository : ${element.name} has been made public.`);
		}
		if (element.type === "WatchEvent") {
			console.log(`- Something is shining in the sky; a star has been added to the repo : ${element.name}.`);
		}
		if (element.type === "ForkEvent") {
			console.log(
				`- A fork was created from this repository : ${element.name}.`,
			);
		}
		if (element.type === "DeleteEvent") {
			console.log(
				`- I hear the sound of a chainsaw—a branch must have been removed from this repository : ${element.name}.`,
			);
		}
		if (element.type === "ReleaseEvent") {
			console.log(
				`- A new version of this repository : ${element.name} is available.`,
			);
		}
	}
}

const argv: Array<string> = Bun.argv;
if (argv.length > 3) {
	console.log("Your input must be a single name, not several separate words.");
} else {
	let userInput: string | undefined = argv[2];
	if (userInput !== undefined) {
		userInput = userInput.trim();
		if (userInput !== "") {
			try {
				const response = await fetch(
					`https://api.github.com/users/${userInput}/events`,
				);
				if (response.status !== 200) {
					handleHTTPErrorcode(response.status);
				} else {
					const data: Array<GitHubAPIResponse> =
						(await response.json()) as Array<GitHubAPIResponse>;
					const mappedData: Array<Activity> = data.map((item) => ({
						type: item.type,
						name: item.repo.name,
					}));
					console.log("Output :");
					if (mappedData.length === 0) {
						console.log("There are no events available for this profile.")
					} else {
						displayGitHubData(mappedData);
					}
				}
			} catch (error) {
				console.error(`An unknown error has occurred : ${error}`);
			}
		} else {
			console.log("UserInput cannot be an empty string.");
		}
	} else {
		console.log("UserInput cannot be undefined.");
	}
}
