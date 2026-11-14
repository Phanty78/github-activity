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
							console.log("Too much request.");
							break;
						case 500:
							console.log("Internal Server Error.");
							break;
						default:
							console.log("Unknown error appear.");
							break;
					}
				} else {
					const text = await response.text();
					console.log(text);
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log("UserInput cannot be an empty string.");
		}
	} else {
		console.log("UserInput cannot be undefined.");
	}
}
