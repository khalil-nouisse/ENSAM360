//Handles req/res for chatbot routes.
const { chatWithLLM } = require('../services/chatbotService');  // ✅ Import correctly

const handleChat = async (req, res) => {
    try {
        const { message, locationID } = req.body;  // ✅ Fixed typo: "message" not "messsage"
        
        // Optional: validate input
        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        console.log("Received chat request:", { message, locationID });  // ✅ Debug log

        const response = await chatWithLLM(message, locationID);  // ✅ Use correct variable name

        res.status(200).json({  // ✅ Fixed: dot instead of comma
            type: response.type,
            message: response.text,
            destinationName: response.destinationName  // Include for navigation actions
        });

    } catch(err) {
        console.error("Controller error:", err);  // ✅ Better logging
        res.status(500).json({
            message: "Error handling chat by chatbot",
            error: err.message
        });
    }
};

module.exports = { handleChat };