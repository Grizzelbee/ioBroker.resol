{"dp": [{"dpName":"Pumpe1", "name":"Manual controll for this relay.", "type":"number","min":0, "max":2, "states":{"0":"Off", "1":"Auto", "2":"On"}},
	    {"dpName":"Pumpe2", "name":"Manual controll for this relay.", "type":"number","min":0,"max":2, "states":{"0":"Off", "1":"Auto", "2":"On"}},
		{"dpName":"AutoRueckkuehl", "name":"Automatic cool down of buffer.","type":"number","min":0,"max":1, "states":{"0":"Off","1":"On"}}
	   ],
"fct": [{"name":"Pumpe1","cmd":"Handbetrieb1","val":"val"},
		{"name":"Pumpe2","cmd":"Handbetrieb2","val":"val"},
		{"name":"AutoRueckkuehl","cmds":[{"cmd":"ORueckkuehlung","val":"val"},{"cmd":"OHolyCool","val":"val"}]}
	   ]}