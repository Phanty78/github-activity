console.log("Enter a valid GitHub username to view that user's activity.");

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
					switch (response.status) {
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
				} else {
					const data : unknown = await response.json()
					const mappedData = data.map(item => ({
						type : item.type,
						name : item.repo.name,
					}));
					console.log("Output :")
					for (let i = 0; i < mappedData.length - 1; i++) {
						// Attention, ce n'est pas exactement ce qui est demandé dans l'énoncé.
						if (mappedData[i].type === "PushEvent") {
							console.log(`- Pushed some code in ${mappedData[i].name}`)
						}
						if (mappedData[i].type === "PublicEvent") {
							console.log(`- The repository : ${mappedData[i].name} has been made public.`)
						}
						if (mappedData[i].type === "WatchEvent") {
							console.log(`- Took a look at this repository : ${mappedData[i].name}.`)
						}
						if (mappedData[i].type === "ForkEvent") {
							console.log(`- A fork was created from this repository : ${mappedData[i].name}.`)
						}
						if (mappedData[i].type === "DeleteEvent") {
							console.log(`- Oh no, that repository : ${mappedData[i].name} has been permanently deleted.`)
						}
						if (mappedData[i].type === "ReleaseEvent") {
							console.log(`- A new version of this repository : ${mappedData[i].name} is available.`)
						}
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
