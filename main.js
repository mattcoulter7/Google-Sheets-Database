import { Query } from "./Query"
import { GAPI } from "./GAPI"

const main = () => {
    Query.connect(
        new GAPI(
            '1xOd5i8A-ASM_LATSwAzUCwqaB_MEhgzKkZv7LcnnsH0', // spreadsheetid
            'AKfycbyZ-YqwCmphCZK4Sg32qUB3NqHs0h8xnXA5MByOy4t7vhKHoeHdO3JmXw' // deploymentid
        )
    )
}

main()