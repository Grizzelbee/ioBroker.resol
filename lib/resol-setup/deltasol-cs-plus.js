{"dp": [{"dpName":"Pumpe1","type":"number","min":0,"max":2, "states":{"Off":0,"Auto":1,"On":2}},
	    {"dpName":"Pumpe2","type":"number","min":0,"max":2, "states":{"Off":0,"Auto":1,"On":2}},
		{"dpName":"AutoRueckkuehl","type":"number","min":0,"max":1, possibleValues:{"Off":0,"On":1}}
	   ],
"fct": [{"name":"Pumpe1","cmd":"Handbetrieb1","val":"val"},
		{"name":"Pumpe2","cmd":"Handbetrieb2","val":"val"},
		{"name":"AutoRueckkuehl","cmds":[{"cmd":"ORueckkuehlung","val":"val"},{"cmd":"OHolyCool","val":"val"}]}
	   ]}