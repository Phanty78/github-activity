console.log("Enter a valid GitHub username to view that user's activity.");

for await (const line of console) {
    const splitedUserInput: Array<string> = line.split(" ");
    if (splitedUserInput.length > 1 ){
        console.log("Your input must be a single name, not several separate words.")
    } else {
        let userInput : string | undefined = splitedUserInput[0]
        if (userInput !== null && userInput !== undefined){
            userInput = userInput.trim()
            if (userInput !== "") {
                const response = await fetch(`https://api.github.com/users/${userInput}/events`);
                if (response.status === 404) {
                    console.log("That user does not exist.")
                } else {
                    const text = await response.text();
                    console.log(text)
                }
            } else {
                console.log("UserInput cannot be an empty string.")
            }
        } else {
            console.log("UserInput cannot be null or undefined.")
        }
    }

}   
