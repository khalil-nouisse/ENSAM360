//Handles req/res for chatbot routes.
const { chatWithLLM } = require('../services/chatbotService');

const handleChat = async (req, res) => {
    try {
        const { message, locationID, userId } = req.body;

        // Optional: validate input
        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        console.log("Received chat request:", { message, locationID, userId });

        const response = await chatWithLLM(message, locationID, userId);

        res.status(200).json({
            type: response.type,
            message: response.text,
            destinationName: response.destinationName  // Include for navigation actions
        });

    } catch (err) {
        console.error("Controller error:", err);
        res.status(500).json({
            message: "Error handling chat by chatbot",
            error: err.message
        });
    }
};

module.exports = { handleChat };