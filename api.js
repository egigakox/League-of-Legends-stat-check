const apikey = "your-key-goes-here";
    var id;
    var server;
    var nick;
    var version;
    async function v() {
        let version_url = "https://ddragon.leagueoflegends.com/api/versions.json";
        const version_response = await fetch(version_url);
        const ver = await version_response.json();
        version = ver[0];
    }
    v();
        async function getinfo() {
          //get form values
          nick = document.getElementById("nickname").value;
          server = document.getElementById('server').value;
          //hide everything
          document.getElementById("error").style.display = "none";
          document.getElementById("soloqstats").style.display = "none";
          document.getElementById("flexqstats").style.display = "none";


        var info_url = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nick}?api_key=${apikey}`;
        const response = await fetch(info_url);
        const data = await response.json();
        var { name, profileIconId, summonerLevel } = data;
        //get icon from datadragon 
        document.getElementById("icon").src = `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`;
        document.getElementById("summonername").textContent = name;
        document.getElementById("level").textContent = summonerLevel;
        document.getElementById("informacje").style.visibility = "visible";
        id = data.id;
        if (summonerLevel >= 30) {
            //display information
            rankinfo();

        } else if (summonerLevel < 30) {
          //prompt if player level is smaller than 30
          swal("Error", `Summoner ${name} is under 30 level \n He can't play rankeds`, "error");
          document.getElementById("soloqstats").style.display = "none";
          document.getElementById("flexqstats").style.display = "none";
        }

      }

      async function rankinfo() {
        var serv = server;
        var idu = id;
        var name = nick;
      var rank_url = `https://${serv}.api.riotgames.com/lol/league/v4/entries/by-summoner/${idu}?api_key=${apikey}`
      const response = await fetch(rank_url);
      const data = await response.json();

      const datalength = data.length;
      switch (datalength) {
        case 0:
        //0 if player has not played any ranked games
        swal("Error", `Summoner ${name} hasn't played ranked games`, "error");
        document.getElementById("soloqstats").style.display = "none";
        document.getElementById("flexqstats").style.display = "none";
        break;
        case 1:
        var { tier, rank, leaguePoints, wins, losses } = data[0];
        //1 if played only soloq or only flexq
        document.getElementById("soloqstats").style.display = "inline";
        document.getElementById("ranksoloq").textContent = tier+ " "+ rank;
        document.getElementById("lp").textContent = leaguePoints;
        document.getElementById("winy").textContent = wins;
        document.getElementById("losy").textContent = losses;
        var games = wins+losses;
        document.getElementById("wr").textContent = +Math.round(wins / games *100)+"%";
        
        swal("Error", `Summoner ${name} hasn't played Flex Rankeds`, "error");
        document.getElementById("flexqstats").style.display = "none";
          break;
        case 2:
        var { tier, rank, leaguePoints, wins, losses } = data[0];
        //2 if played both ranked modes

        //soloq
        document.getElementById("soloqstats").style.display = "inline";
        document.getElementById("flexqstats").style.display = "inline";
        document.getElementById("ranksoloq").textContent = tier+ " "+ rank;
        document.getElementById("lp").textContent = leaguePoints;
        document.getElementById("winy").textContent = wins;
        document.getElementById("losy").textContent = losses;
        var games = wins+losses;
        document.getElementById("wr").textContent = +Math.round(wins / games *100)+"%";
        var tier1 = data[1].tier;
        var rank1 = data[1].rank;
        var leaguePoints1 = data[1].leaguePoints;
        var wins1 = data[1].wins;
        var losses1 = data[1].losses;

        //flexq
        document.getElementById("rankflex").textContent = tier1+ " "+ rank1;
        document.getElementById("lpflex").textContent = leaguePoints1;
        document.getElementById("winyflex").textContent = wins1;
        document.getElementById("losyflex").textContent = losses1;
        var gamesflex = wins1+losses1;
        document.getElementById("wrflex").textContent = +Math.round(wins1 / gamesflex *100)+"%";
        break;
      }

      }
