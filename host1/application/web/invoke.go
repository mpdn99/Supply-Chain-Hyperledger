package web

import (
	"fmt"
	"net/http"

	"github.com/hyperledger/fabric-gateway/pkg/client"
)

func (setup *OrgSetup) Invoke(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := r.FormValue("chaincodeid")
	channelID := r.FormValue("channelid")
	function := r.FormValue("function")
	args := r.Form["args"]
	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, args)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)
	txn_proposal, err := contract.NewProposal(function, client.WithArguments(args...))
	if err != nil {
		fmt.Fprintf(w, "%s", err)
		return
	}
	txn_endorsed, err := txn_proposal.Endorse()
	if err != nil {
		fmt.Fprintf(w, "%s", err)
		return
	}
	txn_committed, err := txn_endorsed.Submit()
	if err != nil {
		fmt.Fprintf(w, "%s", err)
		return
	}
	fmt.Fprintf(w, `{"transactionID":"%s"}`, txn_committed.TransactionID())
}