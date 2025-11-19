function cashfree(sessionid){

  console.log("Session id inside cashfreee function",sessionid)

  const cashfree = Cashfree({

    // mode:"sandbox" //or production

    mode:"sandbox" 

  });



  let checkoutOptions = {

    paymentSessionId: sessionid,

    redirectTarget: "_self" //optional (_self or _blank)

  }



  cashfree.checkout(checkoutOptions)

}

