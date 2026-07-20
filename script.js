async function searchItem() {

    const item = document.getElementById("itemName").value.trim().toUpperCase();

    if (item === "") {
        alert("Enter Item ID");
        return;
    }

    const url = `https://europe.albion-online-data.com/api/v2/stats/prices/${item}.json`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        const cityIds = {
            "Bridgewatch": ["bwBuy", "bwSell"],
            "Martlock": ["mlBuy", "mlSell"],
            "Lymhurst": ["lyBuy", "lySell"],
            "Fort Sterling": ["fsBuy", "fsSell"],
            "Thetford": ["tfBuy", "tfSell"],
            "Caerleon": ["clBuy", "clSell"]
        };

        let lowestBuy = Infinity;
        let highestSell = 0;
        let buyCity = "";
        let sellCity = "";

        for (const city in cityIds) {

            const records = data.filter(r => r.city === city);

            let buy = 0;
            let sell = 0;

            records.forEach(r => {

                if (r.sell_price_min > 0 && (buy === 0 || r.sell_price_min < buy)) {
                    buy = r.sell_price_min;
                }

                if (r.buy_price_max > sell) {
                    sell = r.buy_price_max;
                }

            });

            document.getElementById(cityIds[city][0]).textContent = buy;
            document.getElementById(cityIds[city][1]).textContent = sell;

            if (buy > 0 && buy < lowestBuy) {
                lowestBuy = buy;
                buyCity = city;
            }

            if (sell > highestSell) {
                highestSell = sell;
                sellCity = city;
            }

        }

        if (lowestBuy !== Infinity && highestSell > 0) {

            document.getElementById("flipResult").innerHTML =
                `Buy From: <b>${buyCity}</b> (${lowestBuy})<br>
                 Sell At: <b>${sellCity}</b> (${highestSell})<br>
                 Profit: <b>${highestSell - lowestBuy}</b> silver/item`;

        } else {

            document.getElementById("flipResult").textContent =
                "No profitable flip found.";

        }

    } catch (error) {

        console.log(error);
        alert("API Error");

    }
}

function calculateProfit() {

    const buy = Number(document.getElementById("buyPrice").value);
    const sell = Number(document.getElementById("sellPrice").value);
    const qty = Number(document.getElementById("quantity").value);

    if (!buy || !sell || !qty) {
        document.getElementById("profitResult").textContent =
            "Profit: Enter all values";
        return;
    }

    const profit = (sell - buy) * qty;

    document.getElementById("profitResult").textContent =
        "Profit: " + profit.toLocaleString() + " silver";
}