function otc_function() {
    //Their pubkey
    var div = document.createElement("div");
    document.body.appendChild(div);

    var title = document.createElement("h3");
    title.innerHTML = "direct derivatives form";
    div.appendChild(title);

    var status = document.createElement("p");
    status.innerHTML = "status: <font color=\"green\">ready</font>";
    div.appendChild(status);
    var their_address = text_input("their_address: ", div);
    div.appendChild(br());
    //verify internally that our address matches the contract.
    var oracle = text_input("oracle: ", div);
    div.appendChild(br());
    var our_amount = text_input("our bet amount: ", div);
    div.appendChild(br());
    var their_amount = text_input("their bet amount: ", div);
    div.appendChild(br());
    var bet_direction = text_input("you win if outcome is: ", div);
    div.appendChild(br());
    var oracle_type = text_input("scalar or binary oracle?: ", div);
    div.appendChild(br());
    var bits = text_input("if it is scalar, how many bits does it have?", div);
    div.appendChild(br());
    startButton = button_maker2("offer to make this trade", start);
    div.appendChild(startButton);
    function start() {
        var db = {};
        db.their_address_val = parse_address(their_address.value);
        //var their_address_val = parse_address(their_address.value);
        db.oracle_val = oracle.value.trim().replace(/\./g,'');
        //var oracle_val = oracle.value.trim().replace(/\./g,'');
        if (!(db.oracle_val.length == 44)) {
            status.innerHTML = "status: <font color=\"red\">Error: oracle ID is badly formatted or missing</font>";
            return 0;
        }
        //var our_amount_val = read_veo(our_amount);
        db.our_amount_val = read_veo(our_amount);
        //var their_amount_val = read_veo(their_amount);
        db.their_amount_val = read_veo(their_amount);
        //var oracle_type_val;
        //var bits_val = parseInt(bits.value, 10);
        db.bits_val = parseInt(bits.value, 10);
        if (oracle_type.value.trim() == "scalar") {
            db.oracle_type_val = 1;
            db.bits_val = parseInt(bits, 10);
        } else if (oracle_type.value.trim() == "binary") {
            db.oracle_type_val = 0;
        } else {
            status.innerHTML = "status: <font color=\"red\">Error: oracle_type must be 'scalar' or 'binary'</font>";
            return 0;
        }
        //var bet_direction_val;
        if (bet_direction.value.trim() == "true") {
            db.bet_direction_val = 1;
        } else if (bet_direction.value.trim() == "false") {
            db.bet_direction_val = 0;
        } else {
            status.innerHTML = "status: <font color=\"red\">Error:`you win if outcome is` must be 'true' or 'false'</font>";
            return 0;
        }
    //our private key needs to be loaded.
        //check all values are valid for making the contract.
        //check that the oracle exists, and if scalar that enough bits exist.
        return merkle.request_proof("oracles", db.oracle_val, function(x) {
            var result = x[2];
            if (!(result == 0)) {
                status.innerHTML = "status: <font color=\"red\">Error: That oracle does not exist.</font>";
                return 0;
            }
            //check that this server allows for sending encrypted messages. port 8088 message {test} should return ["ok", "success 2"].
            //check that we each have enough money to participate. port 8088 message {account, Pubkey}
            return start2(db);
        });
    }
    function start2(db) {
        return variable_public_get(["account", keys.pub()], function(my_acc) {
            if (my_acc == "empty") {
                status.innerHTML = "status: <font color=\"red\">Error: load a private key with sufficient funds.</font>";
                return 0;
            } else if (my_acc[1] < (db.our_amount_val + 1000000)) {
                status.innerHTML = "status: <font color=\"red\">Error: you don't have enough funds to make a bet that big.</font>";
                return 0;
            }
            return variable_public_get(["account", db.their_address_val], function(their_acc) {
                if (their_acc == "empty") {
                    status.innerHTML = "status: <font color=\"red\">Error: your partner needs to have veo in their account to make a channel.</font>";
                    return 0;
                } else if (their_acc[1] < (db.their_amount_val + 1000000)) {
                    status.innerHTML = "status: <font color=\"red\">Error: you partner doesn't have enough veo to make a bet that big.</font>";
                    return 0;
                }
                return start3(db);
            });
        });
    }
    function start3(db) {
            
        return messenger(["account", keys.pub], function(a) {
            if (a < 1000000) { //10 milibits
                status.innerHTML = "status: <font color=\"green\">you don't have enough credits, now puchasing more.</font>";
                //purchase more credits here.
            }
            //wait enough confirmations until you have the credits.
            console.log("my credits");
            console.log(a);
            status.innerHTML = "status: <font color=\"green\">sending trade request. Tell your partner to check their messages from the same server you are using. </font>";
        //generate the contract
        //send signature along with info needed to generate the contract to carol
        //check every 10 seconds if Carol has responded with a signature for the smart contract.
        //The light node makes a big warning, telling Bob that he needs to save the signed smart contract to a file.
            status.innerHTML = "status: <font color=\"green\">trade request was accepted, now making a channel.</font>";
       //The light node signs a tx to make the channel, send it as an encrypted message to Carol.
        //The light node checks every 10 seconds until it sees that the new tx has been included in a block.
            status.innerHTML = "status: <font color=\"green\">The channel has been formed, and the smart contract is active. If you have saved a copy of the signed smart contract, then it is now safe to close the browser.</font>";
        //after you save, the message about needing to save changes to "it is now safe to turn off the light node, make sure to keep a copy of the channel state that you have already saved to a file."
        });
    };
    return {};
}

var otc_object = otc_function();