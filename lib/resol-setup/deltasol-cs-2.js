{"dp": [{"dpName":"Pumpe", "name":"Manual control for this relay.", "type":"number","min":0, "max":2, "states":{"0":"Off", "1":"Auto", "2":"On"}},
		{"dpName":"AutoRueckkuehl", "name":"Automatic cool down of buffer.","type":"number","min":0,"max":1, "states":{"0":"Off","1":"On"}},
		{"dpName":"THolyCool", "name":"Temp. cooling buffer","type":"number","min":0,"max":800}
	   ],
"fct": [{"name":"Pumpe","cmd":"Handbetrieb1","val":"val"},
		{"name":"AutoRueckkuehl","cmds":[{"cmd":"ORueckkuehlung","val":"val"},{"cmd":"OHolyCool","val":"val"}]},
		{"name":"THolyCool","cmd":"THolyCool","val":"val"}
	   ]}