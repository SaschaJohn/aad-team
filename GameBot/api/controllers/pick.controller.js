const PickStrategyFactory = require('../services/pickStrategyFactory.service');
const appInsights = require("applicationinsights");

const pick = async (req, res) => {
    var Player1Name = req.body.Player1Name;
    //var TurnNumber = req.body.TurnNumber;
    var matchId = req.body.MatchId;
    if (Player1Name == undefined || matchId == undefined) {
        res.status(400);
        res.send("Player1NamerId or MatchId undefined");
        return;
    }

    // implement arcade intelligence here
    const strategyOption = process.env.PICK_STRATEGY || "RANDOM";
    const result = pickFromStrategy(strategyOption);
    console.log('Against '+Player1Name+', strategy ' + strategyOption + '  played ' + result.text + 'TurnNumber' + req.body);
    
    const applicationInsightsIK = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
    if (applicationInsightsIK) {
        if (appInsights && appInsights.defaultClient)
        {
            var client = appInsights.defaultClient;
            client.commonProperties = {
                strategy: strategyOption
            };
            client.trackEvent({name: "pick", properties: {matchId: matchId, strategy: strategyOption, move: result.text, player: Player1Name, bet: result.bet}});
        }
    }
    //1 Paper , 2 scissor
    if (false && Player1Name == 'Courtney' || Player1Name == 'Libby') {

        if (TurnNumber == 0) {
            res.send({ "Move": "Paper", "Bet": 1 });
            client.trackEvent({name: "pick", properties: {matchId: matchId, strategy: strategyOption, move: "Cheat 0", player: Player1Name, bet: result.bet}});
        }
        if (TurnNumber == 1) {
            res.send({ "Move": "Scissor", "Bet": 1 });
            client.trackEvent({name: "pick", properties: {matchId: matchId, strategy: strategyOption, move: "cheat 1", player: Player1Name, bet: result.bet}});
        }

        
    }
    else 
        res.send({ "Move": result.text, "Bet": result.bet });
};

const pickFromStrategy = (strategyOption) => {
    const strategyFactory = new PickStrategyFactory();

    strategyFactory.setDefaultStrategy(strategyOption);
    const strategy = strategyFactory.getStrategy();
    return strategy.pick();
}

module.exports = {
    pick,
}