// SIDC parts for tactical points
module.exports = function tacticalPoints(sidc,bbox,icn,std2525){
// Tactical Point Symbols =========================================================================


//sidc['G-T-GD----'] = [];//2.X.1.1.9
//sidc['G-T-GI----'] = [];//2.X.1.1.13
//sidc['G-T-GN----'] = [];//2.X.1.1.15
sidc['G-C-MGPFE-'] = icn['TP.FIX ELECTRO-MAGNETIC'];//2.X.2.1.1.1.1.2
sidc['G-C-MGPFA-'] = icn['TP.FIX ACOUSTIC'];//2.X.2.1.1.1.1.2
sidc['G-C-MGPFO-'] = icn['TP.FIX ELECTRO-OPTICAL'];//2.X.2.1.1.1.1.3
//sidc['G-C-MGPI--'] = [];//2.X.2.1.1.1.2
//sidc['G-C-MAAP--'] = [];//2.X.2.1.2.1.1
//sidc['G-C-MAAC--'] = [];//2.X.2.1.2.1.2
//sidc['G-C-MAAU--'] = [];//2.X.2.1.2.1.3
//sidc['G-C-MAAD--'] = [];//2.X.2.1.2.1.4
//sidc['G-C-MMPT--'] = [];//2.X.2.1.4.1.1
//sidc['G-C-MMPO--'] = [];//2.X.2.1.4.1.4
//sidc['G-C-MMPO C-'] = [];//2.X.2.1.4.1.4.1
//sidc['G-C-MMPO R-'] = [];//2.X.2.1.4.1.4.2
//sidc['G-C-MMPO F-'] = [];//2.X.2.1.4.1.4.3
//sidc['G-C-MMPO S-'] = [];//2.X.2.1.4.1.4.4
//sidc['G-C-MMPO N-'] = [];//2.X.2.1.4.1.4.5
//sidc['G-C-MMPO N-'] = [];//2.X.2.1.4.1.4.6
//sidc['G-C-MMPO N-'] = [];//2.X.2.1.4.1.4.7
//sidc['G-C-MO PD--'] = [];//2.X.2.1.5.1.1
//sidc['G-C-BO AB--'] = [];//2.X.2.2.1.4
//sidc['G-C-BO AM A-'] = [];//2.X.2.2.1.5.1
//sidc['G-C-BO AM T-'] = [];//2.X.2.2.1.5.2
//sidc['G-C-BO AM D-'] = [];//2.X.2.2.1.5.3
//sidc['G-C-BO AM C-'] = [];//2.X.2.2.1.5.4
//sidc['G-C-BO AM U-'] = [];//2.X.2.2.1.5.5
//sidc['G-C-BO AM N-'] = [];//2.X.2.2.1.5.6
//sidc['G-C-BY CG--'] = [];//2.X.2.2.2.2.8
//sidc['G-C-BS E---'] = [];//2.X.2.2.3.1
//sidc['G-C-BS F---'] = [];//2.X.2.2.3.2
//sidc['G-C-BS H---'] = [];//2.X.2.2.3.6
//sidc['G-C-BS U---'] = [];//2.X.2.2.3.7
//sidc['G-C-BW DP--'] = [];//2.X.2.2.4.11.1
//sidc['G-C-BW DA--'] = [];//2.X.2.2.4.11.2
//sidc['G-C-BW DT--'] = [];//2.X.2.2.4.11.3
//sidc['G-C-BW DE--'] = [];//2.X.2.2.4.11.4
//sidc['G-C-BW DS--'] = [];//2.X.2.2.4.11.5
//sidc['G-C-BW DO--'] = [];//2.X.2.2.4.11.6
//sidc['G-C-BW DG--'] = [];//2.X.2.2.4.11.7
//sidc['G-C-BW DE M-'] = [];//2.X.2.2.4.11.8
//sidc['G-C-BW DT F-'] = [];//2.X.2.2.4.11.9
//sidc['G-C-FS TP--'] = [];//2.X.2.3.1.1.1
//sidc['G-C-FS S---'] = [];//2.X.2.3.1.2
//sidc['G-C-FA U---'] = [];//2.X.2.3.3.9
//sidc['G-C-SP A---'] = [];//2.X.2.4.1.1
//sidc['G-C-SP C---'] = [];//2.X.2.4.1.2
//sidc['G-C-SP Y---'] = [];//2.X.2.4.1.3
//sidc['G-C-SP T---'] = [];//2.X.2.4.1.4
//sidc['G-C-SP D---'] = [];//2.X.2.4.1.5
//sidc['G-C-SP E---'] = [];//2.X.2.4.1.6
//sidc['G-C-SP L---'] = [];//2.X.2.4.1.7
//sidc['G-C-SP M---'] = [];//2.X.2.4.1.8
//sidc['G-C-SP R---'] = [];//2.X.2.4.1.9
//sidc['G-C-SP U---'] = [];//2.X.2.4.1.10
//sidc['G-C-SP O---'] = [];//2.X.2.4.1.11
//sidc['G-C-SP I---'] = [];//2.X.2.4.1.12
//sidc['G-C-SP N---'] = [];//2.X.2.4.1.13
//sidc['G-C-SP QT--'] = [];//2.X.2.4.1.14.1
//sidc['G-C-SP QA--'] = [];//2.X.2.4.1.14.2
//sidc['G-C-SP QB--'] = [];//2.X.2.4.1.14.3
//sidc['G-C-SP QC--'] = [];//2.X.2.4.1.14.4
//sidc['G-C-SP QD--'] = [];//2.X.2.4.1.14.5
//sidc['G-C-SP QE--'] = [];//2.X.2.4.1.14.6
//sidc['G-C-SP QF--'] = [];//2.X.2.4.1.14.7
//sidc['G-C-SP QG--'] = [];//2.X.2.4.1.14.8
//sidc['G-C-SP QH--'] = [];//2.X.2.4.1.14.9
//sidc['G-C-SP QI--'] = [];//2.X.2.4.1.14.10
//sidc['G-C-SP QJ--'] = [];//2.X.2.4.1.14.11
//sidc['G-C-SP MA--'] = [];//2.X.2.4.1.15.1
//sidc['G-C-SP MT--'] = [];//2.X.2.4.1.15.2
//sidc['G-C-OX----'] = [];//2.X.2.5.1
//sidc['G-C-OXRN--'] = [];//2.X.2.5.1.1.1
//sidc['G-C-OXRD--'] = [];//2.X.2.5.1.1.2
  sidc['G-C-OXUD--'] = icn['TP.DATUM'];//2.X.2.5.1.2.1
  bbox['G-C-OXUD--'] = {x1:50,x2:150,y1:50,y2:150};
  sidc['G-C-OXUB--'] = icn['TP.BRIEF CONTACT'];//2.X.2.5.1.2.2
  bbox['G-C-OXUB--'] = {x1:50,x2:150,y1:0,y2:100};
  sidc['G-C-OXUL--'] = icn['TP.LOST CONTACT'];//2.X.2.5.1.2.3
  bbox['G-C-OXUL--'] = {x1:50,x2:150,y1:0,y2:100};
  sidc['G-C-OXUS--'] = icn['TP.SINKER'];//2.X.2.5.1.2.4
  bbox['G-C-OXUS--'] = {x1:50,x2:150,y1:0,y2:100};
  sidc['G-C-OXWA--'] = icn['TP.AIM POINT'];//2.X.2.5.1.3.1
  bbox['G-C-OXWA--'] = {x1:50,x2:150,y1:50,y2:150};
  sidc['G-C-OXWD--'] = icn['TP.DROP POINT'];//2.X.2.5.1.3.2
  bbox['G-C-OXWD--'] = {x1:50,x2:150,y1:50,y2:120};	
  sidc['G-C-OXWE--'] = icn['TP.ENTRY POINT'];//2.X.2.5.1.3.3
  bbox['G-C-OXWE--'] = {x1:50,x2:150,y1:50};
  sidc['G-C-OXWG--'] = icn['TP.GROUND ZERO'];//2.X.2.5.1.3.4
  bbox['G-C-OXWG--'] = {x1:50,x2:150,y1:30};
  sidc['G-C-OXWM--'] = icn['TP.MSL DETECT POINT'];//2.X.2.5.1.3.5
  bbox['G-C-OXWM--'] = {x1:50,x2:150,y1:30};
  sidc['G-C-OXWI--'] = icn['TP.IMPACT POINT'];//2.X.2.5.1.3.6
  bbox['G-C-OXWI--'] = {x1:50,x2:150,y1:50,y2:150};
  sidc['G-C-OXWP--'] = icn['TP.PREDICTED IMPACT POINT'];//2.X.2.5.1.3.7
  bbox['G-C-OXWP--'] = {x1:50,x2:150,y1:50,y2:150};
  sidc['G-C-OXY---'] = icn['TP.SONOBUOY'];//2.X.2.5.1.4
  bbox['G-C-OXY---'] = {x1:60,x2:140,y1:-10,y2:160};
  sidc['G-C-OXYP--'] = icn['TP.SONOBUOY PATTERN CENTER'];//2.X.2.5.1.4.1
  bbox['G-C-OXYP--'] = {x1:60,x2:140,y1:-10,y2:160};
  sidc['G-C-OXYD--'] = icn['TP.SONOBUOY DIFAR'];//2.X.2.5.1.4.2
  bbox['G-C-OXYD--'] = {x1:60,x2:140,y1:-10,y2:160};
  sidc['G-C-OXYL--'] = icn['TP.SONOBUOY LOFAR'];//2.X.2.5.1.4.3
  bbox['G-C-OXYL--'] = {x1:60,x2:140,y1:-10,y2:160};
  sidc['G-C-OXYC--'] = icn['TP.SONOBUOY CASS'];//2.X.2.5.1.4.4
  bbox['G-C-OXYC--'] = {x1:60,x2:140,y1:-10,y2:160};
  sidc['G-C-OXYS--'] = icn['TP.SONOBUOY DICASS'];//2.X.2.5.1.4.5
  bbox['G-C-OXYS--'] = {x1:60,x2:140,y1:-10,y2:160};
  sidc['G-C-OXYB--'] = icn['TP.SONOBUOY BT'];//2.X.2.5.1.4.6
  bbox['G-C-OXYB--'] = {x1:60,x2:140,y1:-10,y2:160};
  sidc['G-C-OXYA--'] = icn['TP.SONOBUOY ANM'];//2.X.2.5.1.4.7
  bbox['G-C-OXYA--'] = {x1:60,x2:140,y1:-10,y2:160};
  sidc['G-C-OXYV--'] = icn['TP.SONOBUOY VLAD'];//2.X.2.5.1.4.8
  bbox['G-C-OXYV--'] = {x1:60,x2:140,y1:-10,y2:160};  
  sidc['G-C-OXYT--'] = icn['TP.SONOBUOY ATAC'];//2.X.2.5.1.4.9
  bbox['G-C-OXYT--'] = {x1:60,x2:140,y1:-10,y2:160};
  sidc['G-C-OXYR--'] = icn['TP.SONOBUOY RO'];//2.X.2.5.1.4.10
  bbox['G-C-OXYR--'] = {x1:60,x2:140,y1:-10,y2:160};
  sidc['G-C-OXYK--'] = icn['TP.SONOBUOY KINGPIN'];//2.X.2.5.1.4.11
  bbox['G-C-OXYK--'] = {x1:60,x2:140,y1:-10,y2:160};
//sidc['G-C-OXN---'] = [];//2.X.2.5.1.5
//sidc['G-C-OXH---'] = [];//2.X.2.5.1.6
//sidc['G-C-OXHQ--'] = [];//2.X.2.5.1.6.1
//sidc['G-C-OXHA--'] = [];//2.X.2.5.1.6.2
//sidc['G-C-OXHY--'] = [];//2.X.2.5.1.6.3
//sidc['G-C-OXHX--'] = [];//2.X.2.5.1.6.4
//sidc['G-C-OXR---'] = [];//2.X.2.5.1.7
//sidc['G-C-OXRR--'] = [];//2.X.2.5.1.7.1
//sidc['G-C-OXRD--'] = [];//2.X.2.5.1.7.2
//sidc['G-C-OXRW--'] = [];//2.X.2.5.1.7.3
//sidc['G-C-OXRP--'] = [];//2.X.2.5.1.7.4
//sidc['G-C-OXRT--'] = [];//2.X.2.5.1.7.5
//sidc['G-C-OXSTC-'] = [];//2.X.2.5.1.8.1
//sidc['G-C-OXSTCP'] = [];//2.X.2.5.1.8.1.1
//sidc['G-C-OXSTCA'] = [];//2.X.2.5.1.8.1.2
//sidc['G-C-OXSTR-'] = [];//2.X.2.5.1.8.2
//sidc['G-C-OXSTH'] = [];//2.X.2.5.1.8.3
//sidc['G-C-OXSTS-'] = [];//2.X.2.5.1.8.4
//sidc['G-C-OXSTSA'] = [];//2.X.2.5.1.8.5
  sidc['G-C-OXS---'] = icn['TP.SEARCH'];//2.X.2.5.1.9 
  bbox['G-C-OXS---'] = {x1:50,x2:150,y1:50,y2:150}; 
  //sidc['G-C-OXSA--'] = []//icn['TP.SEARCH AREA'];//2.X.2.5.1.9.1 TODO
  //bbox['G-C-OXSA--'] = {x1:50,x2:150,y1:50,y2:150};
  //sidc['G-C-OXSD--'] = []//icn['TP.DIP POSITION'];//2.X.2.5.1.9.2 TODO
  //bbox['G-C-OXSD--'] = {x1:50,x2:150,y1:50,y2:150};
  sidc['G-C-OXSC--'] = icn['TP.SEARCH CENTER'];//2.X.2.5.1.9.3
  bbox['G-C-OXSC--'] = {x1:50,x2:150,y1:50,y2:150};
  sidc['G-C-OXAC--'] = icn['TP.COMBAT AIR PATROL (CAP)'];//2.X.2.5.1.10.1
  bbox['G-C-OXAC--'] = {x1:60,x2:140,y1:40,y2:160};
  sidc['G-C-OXAA--'] = icn['TP.AIRBORNE EARLY WARNING (AEW)'];//2.X.2.5.1.10.2
  bbox['G-C-OXAA--'] = {x1:60,x2:140,y1:40,y2:160};
//sidc['G-C-OXAT--'] = [];//2.X.2.5.1.10.3
//sidc['G-C-OXAK--'] = [];//2.X.2.5.1.10.4
//sidc['G-C-OXAF--'] = [];//2.X.2.5.1.10.5
//sidc['G-C-OXAH--'] = [];//2.X.2.5.1.10.6
//sidc['G-C-OXAO--'] = [];//2.X.2.5.1.10.7
//sidc['G-C-OXAR--'] = [];//2.X.2.5.1.10.8
//sidc['G-C-OXAP--'] = [];//2.X.2.5.1.10.9
//sidc['G-C-OXAM--'] = [];//2.X.2.5.1.10.10
//sidc['G-C-OXAS--'] = [];//2.X.2.5.1.10.11
//sidc['G-C-OXAD--'] = [];//2.X.2.5.1.10.12
//sidc['G-C-OG----'] = [];//2.X.2.5.2
//sidc['G-C-OGC---'] = [];//2.X.2.5.2.1
//sidc['G-C-OGP---'] = [];//2.X.2.5.2.2
//sidc['G-C-OGT---'] = [];//2.X.2.5.2.3
//sidc['G-C-OGD---'] = [];//2.X.2.5.2.4
//sidc['G-C-OGL---'] = [];//2.X.2.5.2.5
//sidc['G-C-OGN---'] = [];//2.X.2.5.2.6
//sidc['G-C-OGR---'] = [];//2.X.2.5.2.7
//sidc['G-C-OGS---'] = [];//2.X.2.5.2.8
//sidc['G-C-OGI---'] = [];//2.X.2.5.2.9
//sidc['G-C-OGW---'] = [];//2.X.2.5.2.10
//sidc['G-O-VA----'] = [];//2.X.3.1.1
//sidc['G-O-VR----'] = [];//2.X.3.1.2
//sidc['G-O-VE----'] = [];//2.X.3.1.3
sidc['G-O-VB----'] = icn['AIR.MISSILE.IC.BOMB'];//2.X.3.1.4
sidc['G-O-VY----'] = icn['ST.IC.BOOBY TRAP'];//2.X.3.1.5
sidc['G-O-VD----'] = icn['ST.IC.DRIVE-BY SHOOTING'];//2.X.3.1.6
//sidc['G-O-VI----'] = [];//2.X.3.1.7
//sidc['G-O-VM----'] = [];//2.X.3.1.8
//sidc['G-O-VK----'] = [];//2.X.3.1.9
//sidc['G-O-VS----'] = [];//2.X.3.1.10
//sidc['G-O-VP----'] = [];//2.X.3.1.11
//sidc['G-O-VU----'] = [];//2.X.3.1.12
//sidc['G-O-VC----'] = [];//2.X.3.1.13
//sidc['G-O-VH----'] = [];//2.X.3.1.14
//sidc['G-O-VF----'] = [];//2.X.3.1.15
//sidc['G-O-VO----'] = [];//2.X.3.1.16
//sidc['G-O-VL----'] = [];//2.X.3.1.17
//sidc['G-O-VX----'] = [];//2.X.3.1.18
//sidc['G-O-VZ----'] = [];//2.X.3.1.19
sidc['G-O-LB----'] = icn['ST.IC.BLACK LIST LOCATION'];//2.X.3.2.1
sidc['G-O-LG----'] = icn['ST.IC.GRAY LIST LOCATION'];//2.X.3.2.2
sidc['G-O-LW----'] = icn['ST.IC.WHITE LIST LOCATION'];//2.X.3.2.3
//sidc['G-O-PR----'] = [];//2.X.3.3.1
//sidc['G-O-PR B---'] = [];//2.X.3.3.1.1
//sidc['G-O-PT----'] = [];//2.X.3.3.2
//sidc['G-O-PC----'] = [];//2.X.3.3.3
//sidc['G-O-PC U---'] = [];//2.X.3.3.3.1
sidc['G-O-PD----'] = icn['ST.IC.DEMONSTRATION'];//2.X.3.3.4
sidc['G-O-PM----'] = icn['ST.IC.MINE LAYING'];//2.X.3.3.5
sidc['G-O-PH----'] = icn['ST.IC.PSYCHOLOGICAL OPERATIONS'];//2.X.3.3.6
sidc['G-O-PHY---'] = icn['ST.IC.RADIO AND TELEVISION PSYCHOLOGICAL OPERATIONS'];//2.X.3.3.6.1
sidc['G-O-PHW---'] = [icn['ST.IC.PSYCHOLOGICAL OPERATIONS'],icn['ST.M1.WRITTEN PSYCHOLOGICAL OPERATIONS']];//2.X.3.3.6.2
sidc['G-O-PHG---'] = [icn['ST.IC.PSYCHOLOGICAL OPERATIONS'],icn['ST.M1.WRITTEN PSYCHOLOGICAL OPERATIONS']];//2.X.3.3.6.3
sidc['G-O-PHT---'] = [icn['ST.IC.PSYCHOLOGICAL OPERATIONS'],icn['ST.M1.HOUSE-TO-HOUSE']];//2.X.3.3.6.4
sidc['G-O-PG----'] = icn['ST.IC.SEARCHING'];//2.X.3.3.7
sidc['G-O-PS----'] = icn['ST.IC.SPY'];//2.X.3.3.8
sidc['G-O-PF----'] = icn['ST.IC.FOOD DISTRIBUTION'];//2.X.3.3.9
//sidc['G-O-PI----'] = [];//2.X.3.3.10
//sidc['G-O-PE----'] = [];//2.X.3.3.11
sidc['G-O-PX----'] = icn['ST.IC.EXTORTION'];//2.X.3.3.12
sidc['G-O-PJV---'] = [icn['ST.IC.KNOWN INSURGENT VEHICLE'],icn['ST.M1.HIJACKING/HIJACKED']];//2.X.3.3.13.1
sidc['G-O-PJA---'] = [icn['ST.IC.HIJACKING (AIRPLANE)'],icn['ST.M1.HIJACKING/HIJACKED']];//2.X.3.3.13.2
sidc['G-O-PJB---'] = [icn['ST.IC.HIJACKING (BOAT)'],icn['ST.M1.HIJACKING/HIJACKED']];//2.X.3.3.13.3
sidc['G-O-PK----'] = [icn['ST.IC.INDIVIDUAL'],icn['ST.M1.KIDNAPPING']];//2.X.3.3.14
sidc['G-O-PA----'] = icn['ST.IC.ARREST'];//2.X.3.3.15
sidc['G-O-PO----'] = icn['ST.IC.DRUG RELATED ACTIVITIES'];//2.X.3.3.16
sidc['G-O-IR----'] = icn['ST.IC.GROUP'];//2.X.3.4.1
sidc['G-O-IS----'] = icn['ST.IC.SAFE HOUSE'];//2.X.3.4.2
sidc['G-O-IG----'] = icn['ST.IC.GRAFFITI'];//2.X.3.4.3
sidc['G-O-IV----'] = icn['ST.IC.VANDALISM/LOOT/RANSACK/PLUNDER/SACK'];//2.X.3.4.4
sidc['G-O-IK----'] = icn['ST.IC.KNOWN INSURGENT VEHICLE'];//2.X.3.4.5
sidc['G-O-ID----'] = [icn['ST.IC.KNOWN INSURGENT VEHICLE'],icn['ST.M1.DRUG']];//2.X.3.4.6
sidc['G-O-IF----'] = icn['ST.IC.INTERNAL SECURITY FORCE'];//2.X.3.4.7


	
	
	
	
	
	
	
	
	
	
	
	/*
	
	
	
	
	sidc['G-T-D-----'] = icn['TP.DESTROY'];//TACGRP.TSK.DSTY
	bbox['G-T-D-----'] = {x1:0,x2:200,y1:40,y2:160};
	sidc['G-T-I-----'] = icn['TP.INTERDICT'];//TACGRP.TSK.ITDT
	bbox['G-T-I-----'] = {x1:0,x2:200,y1:40,y2:160};
	sidc['G-T-N-----'] = icn['TP.NEUTRALIZE'];//TACGRP.TSK.NEUT
	bbox['G-T-N-----'] = {x1:0,x2:200,y1:40,y2:160};
	sidc['G-G-GPUUD-'] = icn['TP.DATUM'];//TACGRP.C2GM.GNL.PNT.USW.UH2.DTM
	bbox['G-G-GPUUD-'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPUUB-'] = icn['TP.BRIEF CONTACT'];//TACGRP.C2GM.GNL.PNT.USW.UH2.BCON
	bbox['G-G-GPUUB-'] = {x1:50,x2:150,y1:0,y2:100};
	sidc['G-G-GPUUL-'] = icn['TP.LOST CONTACT'];//TACGRP.C2GM.GNL.PNT.USW.UH2.LCON
	bbox['G-G-GPUUL-'] = {x1:50,x2:150,y1:0,y2:100};
	sidc['G-G-GPUUS-'] = icn['TP.SINKER'];//TACGRP.C2GM.GNL.PNT.USW.UH2.SNK
	bbox['G-G-GPUUS-'] = {x1:50,x2:150,y1:0,y2:100};
	sidc['G-G-GPUY--'] = icn['TP.SONOBUOY'];//TACGRP.C2GM.GNL.PNT.USW.SNBY
	bbox['G-G-GPUY--'] = {x1:60,x2:140,y1:-10,y2:160};
	sidc['G-G-GPUYP-'] = icn['TP.SONOBUOY PATTERN CENTER'];//TACGRP.C2GM.GNL.PNT.USW.SNBY.PTNCTR
	bbox['G-G-GPUYP-'] = {x1:60,x2:140,y1:-10,y2:160};
	sidc['G-G-GPUYD-'] = icn['TP.SONOBUOY DIFAR'];//TACGRP.C2GM.GNL.PNT.USW.SNBY.DIFAR
	bbox['G-G-GPUYD-'] = {x1:60,x2:140,y1:-10,y2:160};
	sidc['G-G-GPUYL-'] = icn['TP.SONOBUOY LOFAR'];//TACGRP.C2GM.GNL.PNT.USW.SNBY.LOFAR
	bbox['G-G-GPUYL-'] = {x1:60,x2:140,y1:-10,y2:160};
	sidc['G-G-GPUYC-'] = icn['TP.SONOBUOY CASS'];//TACGRP.C2GM.GNL.PNT.USW.SNBY.CASS
	bbox['G-G-GPUYC-'] = {x1:60,x2:140,y1:-10,y2:160};
	sidc['G-G-GPUYS-'] = icn['TP.SONOBUOY DICASS'];//TACGRP.C2GM.GNL.PNT.USW.SNBY.DICASS
	bbox['G-G-GPUYS-'] = {x1:60,x2:140,y1:-10,y2:160};
	sidc['G-G-GPUYB-'] = icn['TP.SONOBUOY BT'];//TACGRP.C2GM.GNL.PNT.USW.SNBY.BT
	bbox['G-G-GPUYB-'] = {x1:60,x2:140,y1:-10,y2:160};
	sidc['G-G-GPUYA-'] = icn['TP.SONOBUOY ANM'];//TACGRP.C2GM.GNL.PNT.USW.SNBY.ANM
	bbox['G-G-GPUYA-'] = {x1:60,x2:140,y1:-10,y2:160};
	sidc['G-G-GPUYV-'] = icn['TP.SONOBUOY VLAD'];//TACGRP.C2GM.GNL.PNT.USW.SNBY.VLAD
	bbox['G-G-GPUYV-'] = {x1:60,x2:140,y1:-10,y2:160};	
	sidc['G-G-GPUYT-'] = icn['TP.SONOBUOY ATAC'];//TACGRP.C2GM.GNL.PNT.USW.SNBY.ATAC
	bbox['G-G-GPUYT-'] = {x1:60,x2:140,y1:-10,y2:160};
	sidc['G-G-GPUYR-'] = icn['TP.SONOBUOY RO'];//TACGRP.C2GM.GNL.PNT.USW.SNBY.RO
	bbox['G-G-GPUYR-'] = {x1:60,x2:140,y1:-10,y2:160};
	sidc['G-G-GPUYK-'] = icn['TP.SONOBUOY KINGPIN'];//TACGRP.C2GM.GNL.PNT.USW.SNBY.KGP
	bbox['G-G-GPUYK-'] = {x1:60,x2:140,y1:-10,y2:160};
	sidc['G-G-GPUYX-'] = icn['TP.SONOBUOY EXPIRED'];//TACGRP.C2GM.GNL.PNT.USW.SNBY.EXP
	bbox['G-G-GPUYX-'] = {x1:40,x2:160,y1:-10,y2:160};
	sidc['G-G-GPUS--'] = icn['TP.SEARCH'];//TACGRP.C2GM.GNL.PNT.USW.SRH
	bbox['G-G-GPUS--'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPUSA-'] = icn['TP.SEARCH AREA'];//TACGRP.C2GM.GNL.PNT.USW.SRH.ARA
	bbox['G-G-GPUSA-'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPUSD-'] = icn['TP.DIP POSITION'];//TACGRP.C2GM.GNL.PNT.USW.SRH.DIPPSN
	bbox['G-G-GPUSD-'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPUSC-'] = icn['TP.SEARCH CENTER'];//TACGRP.C2GM.GNL.PNT.USW.SRH.CTR
	bbox['G-G-GPUSC-'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPR---'] = icn['TP.REFERENCE POINT'];//TACGRP.C2GM.GNL.PNT.REFPNT
	bbox['G-G-GPR---'] = {x1:40,x2:160,y1:40,y2:160};
	sidc['G-G-GPRN--'] = icn['TP.NAVIGATIONAL REFERENCE'];//TACGRP.C2GM.GNL.PNT.REFPNT.NAVREF
	bbox['G-G-GPRN--'] = {x1:40,x2:160,y1:40,y2:160};
	sidc['G-G-GPRS--'] = icn['TP.SPECIAL POINT'];//TACGRP.C2GM.GNL.PNT.REFPNT.SPLPNT
	bbox['G-G-GPRS--'] = {x1:40,x2:160,y1:40,y2:160};
	sidc['G-G-GPRD--'] = icn['TP.DLRP'];//TACGRP.C2GM.GNL.PNT.REFPNT.DLRP
	bbox['G-G-GPRD--'] = {x1:40,x2:160,y1:40,y2:160};
	sidc['G-G-GPRP--'] = icn['TP.POINT OF INTENDED MOVEMENT'];//TACGRP.C2GM.GNL.PNT.REFPNT.PIM
	bbox['G-G-GPRP--'] = {x1:40,x2:160,y1:40,y2:160};
	sidc['G-G-GPRM--'] = icn['TP.MARSHALL POINT'];//TACGRP.C2GM.GNL.PNT.REFPNT.MRSH
	bbox['G-G-GPRM--'] = {x1:40,x2:160,y1:40,y2:160};
	sidc['G-G-GPRW--'] = icn['TP.REFERENCE POINT WAYPOINT'];//TACGRP.C2GM.GNL.PNT.REFPNT.WAP
	bbox['G-G-GPRW--'] = {x1:40,x2:160,y1:40,y2:160};
	sidc['G-G-GPRC--'] = icn['TP.CORRIDOR TAB'];//TACGRP.C2GM.GNL.PNT.REFPNT.CRDRTB
	bbox['G-G-GPRC--'] = {x1:40,x2:160,y1:40,y2:160};
	sidc['G-G-GPRI--'] = icn['TP.POINT OF INTEREST'];//TACGRP.C2GM.GNL.PNT.REFPNT.PNTINR
	bbox['G-G-GPRI--'] = {x1:50,x2:150,y1:-25};
	sidc['G-G-GPWA--'] = icn['TP.AIM POINT'];//TACGRP.C2GM.GNL.PNT.WPN.AIMPNT
	bbox['G-G-GPWA--'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPWD--'] = icn['TP.DROP POINT'];//TACGRP.C2GM.GNL.PNT.WPN.DRPPNT
	bbox['G-G-GPWD--'] = {x1:50,x2:150,y1:50,y2:120};	
	sidc['G-G-GPWE--'] = icn['TP.ENTRY POINT'];//TACGRP.C2GM.GNL.PNT.WPN.ENTPNT
	bbox['G-G-GPWE--'] = {x1:50,x2:150,y1:50};
	sidc['G-G-GPWG--'] = icn['TP.GROUND ZERO'];//TACGRP.C2GM.GNL.PNT.WPN.GRDZRO
	bbox['G-G-GPWG--'] = {x1:50,x2:150,y1:30};
	sidc['G-G-GPWM--'] = icn['TP.MSL DETECT POINT'];//TACGRP.C2GM.GNL.PNT.WPN.MSLPNT
	bbox['G-G-GPWM--'] = {x1:50,x2:150,y1:30};
	sidc['G-G-GPWI--'] = icn['TP.IMPACT POINT'];//TACGRP.C2GM.GNL.PNT.WPN.IMTPNT
	bbox['G-G-GPWI--'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPWP--'] = icn['TP.PREDICTED IMPACT POINT'];//TACGRP.C2GM.GNL.PNT.WPN.PIPNT
	bbox['G-G-GPWP--'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPF---'] = icn['TP.FORMATION'];//TACGRP.C2GM.GNL.PNT.FRMN
	bbox['G-G-GPF---'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPH---'] = icn['TP.HARBOR'];//TACGRP.C2GM.GNL.PNT.HBR
	bbox['G-G-GPH---'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPHQ--'] = icn['TP.HARBOR POINT Q'];//TACGRP.C2GM.GNL.PNT.HBR.PNTQ
	bbox['G-G-GPHQ--'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPHA--'] = icn['TP.HARBOR POINT A'];//TACGRP.C2GM.GNL.PNT.HBR.PNTA
	bbox['G-G-GPHA--'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPHY--'] = icn['TP.HARBOR POINT Y'];//TACGRP.C2GM.GNL.PNT.HBR.PNTY
	bbox['G-G-GPHY--'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPHX--'] = icn['TP.HARBOR POINT X'];//TACGRP.C2GM.GNL.PNT.HBR.PNTX
	bbox['G-G-GPHX--'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPO---'] = icn['TP.ROUTE'];//TACGRP.C2GM.GNL.PNT.RTE
	bbox['G-G-GPO---'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPOZ--'] = icn['TP.ROUTE RENDEZVOUS'];//TACGRP.C2GM.GNL.PNT.RTE.RDV
	bbox['G-G-GPOZ--'] = {x1:30,x2:170,y1:60,y2:170};
	sidc['G-G-GPOD--'] = icn['TP.ROUTE DIVERSIONS'];//TACGRP.C2GM.GNL.PNT.RTE.DVSN
	bbox['G-G-GPOD--'] = {x1:30,x2:170,y1:60,y2:170};
	sidc['G-G-GPOW--'] = icn['TP.ROUTE WAYPOINT'];//TACGRP.C2GM.GNL.PNT.RTE.WAP
	bbox['G-G-GPOW--'] = {x1:30,x2:170,y1:60,y2:170};
	sidc['G-G-GPOP--'] = icn['TP.ROUTE PIM'];//TACGRP.C2GM.GNL.PNT.RTE.PIM
	bbox['G-G-GPOP--'] = {x1:30,x2:170,y1:60,y2:170};
	sidc['G-G-GPOR--'] = icn['TP.ROUTE POINT R'];//TACGRP.C2GM.GNL.PNT.RTE.PNTR
	bbox['G-G-GPOR--'] = {x1:30,x2:170,y1:60,y2:170};
	sidc['G-G-GPA---'] = icn['TP.AIR CONTROL POINT'];//TACGRP.C2GM.GNL.PNT.ACTL
	bbox['G-G-GPA---'] = {x1:60,x2:140,y1:40,y2:160};
	sidc['G-G-GPAP--'] = icn['TP.COMBAT AIR PATROL (CAP)'];//TACGRP.C2GM.GNL.PNT.ACTL.CAP
	bbox['G-G-GPAP--'] = {x1:60,x2:140,y1:40,y2:160};
	sidc['G-G-GPAW--'] = icn['TP.AIRBORNE EARLY WARNING (AEW)'];//TACGRP.C2GM.GNL.PNT.ACTL.ABNEW
	bbox['G-G-GPAW--'] = {x1:60,x2:140,y1:40,y2:160};
	sidc['G-G-GPAK--'] = icn['TP.TANKING'];//TACGRP.C2GM.GNL.PNT.ACTL.TAK
	bbox['G-G-GPAK--'] = {x1:60,x2:140,y1:40,y2:160};
	sidc['G-G-GPAA--'] = icn['TP.FIXED WING'];//TACGRP.C2GM.GNL.PNT.ACTL.ASBWF
	bbox['G-G-GPAA--'] = {x1:60,x2:140,y1:40,y2:160};
	sidc['G-G-GPAH--'] = icn['TP.ROTARY WING'];//TACGRP.C2GM.GNL.PNT.ACTL.ASBWR
	bbox['G-G-GPAH--'] = {x1:60,x2:140,y1:40,y2:160};
	sidc['G-G-GPAB--'] = icn['TP.SUCAP - FIXED WING'];//TACGRP.C2GM.GNL.PNT.ACTL.SUWF
	bbox['G-G-GPAB--'] = {x1:60,x2:140,y1:40,y2:160};
	sidc['G-G-GPAC--'] = icn['TP.SUCAP - ROTARY WING'];//TACGRP.C2GM.GNL.PNT.ACTL.SUWR
	bbox['G-G-GPAC--'] = {x1:60,x2:140,y1:40,y2:160};
	sidc['G-G-GPAD--'] = icn['TP.MIW - FIXED WING'];//TACGRP.C2GM.GNL.PNT.ACTL.MIWF
	bbox['G-G-GPAD--'] = {x1:60,x2:140,y1:40,y2:160};
	sidc['G-G-GPAE--'] = icn['TP.MIW - ROTARY WING'];//TACGRP.C2GM.GNL.PNT.ACTL.MIWR
	bbox['G-G-GPAE--'] = {x1:60,x2:140,y1:40,y2:160};
	sidc['G-G-GPAS--'] = icn['TP.STRIKE IP'];//TACGRP.C2GM.GNL.PNT.ACTL.SKEIP
	bbox['G-G-GPAS--'] = {x1:60,x2:140,y1:30,y2:170};
	sidc['G-G-GPAT--'] = icn['TP.TACAN'];//TACGRP.C2GM.GNL.PNT.ACTL.TCN
	bbox['G-G-GPAT--'] = {x1:60,x2:140,y1:30,y2:170};
	sidc['G-G-GPAO--'] = icn['TP.TOMCAT'];//TACGRP.C2GM.GNL.PNT.ACTL.TMC
	bbox['G-G-GPAO--'] = {x1:60,x2:140,y1:30,y2:170};
	sidc['G-G-GPAR--'] = icn['TP.RESCUE'];//TACGRP.C2GM.GNL.PNT.ACTL.RSC
	bbox['G-G-GPAR--'] = {x1:60,x2:140,y1:30,y2:170};
	sidc['G-G-GPAL--'] = icn['TP.REPLENISH'];//TACGRP.C2GM.GNL.PNT.ACTL.RPH
	bbox['G-G-GPAL--'] = {x1:60,x2:140,y1:30,y2:170};
	sidc['G-G-GPAF--'] = icn['TP.UNMANNED AERIAL SYSTEM'];//TACGRP.C2GM.GNL.PNT.ACTL.UA
	bbox['G-G-GPAF--'] = {x1:60,x2:140,y1:30,y2:170};
	sidc['G-G-GPAG--'] = icn['TP.VTUA'];//TACGRP.C2GM.GNL.PNT.ACTL.VTUA
	bbox['G-G-GPAG--'] = {x1:60,x2:140,y1:30,y2:170};
	sidc['G-G-GPAI--'] = icn['TP.ORBIT'];//TACGRP.C2GM.GNL.PNT.ACTL.ORB
	bbox['G-G-GPAI--'] = {x1:60,x2:140,y1:30,y2:170};
	sidc['G-G-GPAJ--'] = icn['TP.ORBIT - FIGURE EIGHT'];//TACGRP.C2GM.GNL.PNT.ACTL.ORBF8
	bbox['G-G-GPAJ--'] = {x1:60,x2:140,y1:30,y2:170};
	sidc['G-G-GPAM--'] = icn['TP.ORBIT - RACE TRACK'];//TACGRP.C2GM.GNL.PNT.ACTL.ORBRT
	bbox['G-G-GPAM--'] = {x1:60,x2:140,y1:30,y2:170};
	sidc['G-G-GPAN--'] = icn['TP.ORBIT - RANDOM, CLOSED'];//TACGRP.C2GM.GNL.PNT.ACTL.ORBRD
	bbox['G-G-GPAN--'] = {x1:60,x2:140,y1:30,y2:170};
	sidc['G-G-GPP---'] = icn['TP.ACTION POINT'];//TACGRP.C2GM.GNL.PNT.ACTPNT
	bbox['G-G-GPP---'] = {x1:60,x2:140,y1:-60};
	sidc['G-G-GPPK--'] = icn['TP.ACTION CHECK POINT'];//TACGRP.C2GM.GNL.PNT.ACTPNT.CHKPNT
	bbox['G-G-GPPK--'] = {x1:60,x2:140,y1:-60};
	sidc['G-G-GPPC--'] = icn['TP.CONTACT POINT'];//TACGRP.C2GM.GNL.PNT.ACTPNT.CONPNT
	bbox['G-G-GPPC--'] = {x1:55,x2:145,y1:-10};
	sidc['G-G-GPPO--'] = icn['TP.COORDINATION POINT'];//TACGRP.C2GM.GNL.PNT.ACTPNT.CRDPNT
	bbox['G-G-GPPO--'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-GPPD--'] = icn['TP.DECISION POINT'];//TACGRP.C2GM.GNL.PNT.ACTPNT.DCNPNT
	bbox['G-G-GPPD--'] = {x1:30,x2:170,y1:25,y2:160};
	sidc['G-G-GPPL--'] = icn['TP.ACTION LINKUP POINT'];//TACGRP.C2GM.GNL.PNT.ACTPNT.LNKUPT
	bbox['G-G-GPPL--'] = {x1:60,x2:140,y1:-60};
	sidc['G-G-GPPP--'] = icn['TP.ACTION PASSAGE POINT'];//TACGRP.C2GM.GNL.PNT.ACTPNT.PSSPNT
	bbox['G-G-GPPP--'] = {x1:60,x2:140,y1:-60};
	sidc['G-G-GPPR--'] = icn['TP.ACTION RALLY POINT'];//TACGRP.C2GM.GNL.PNT.ACTPNT.RAYPNT
	bbox['G-G-GPPR--'] = {x1:60,x2:140,y1:-60};
	sidc['G-G-GPPE--'] = icn['TP.ACTION RELEASE POINT'];//TACGRP.C2GM.GNL.PNT.ACTPNT.RELPNT
	bbox['G-G-GPPE--'] = {x1:60,x2:140,y1:-60};
	sidc['G-G-GPPS--'] = icn['TP.ACTION START POINT'];//TACGRP.C2GM.GNL.PNT.ACTPNT.STRPNT
	bbox['G-G-GPPS--'] = {x1:60,x2:140,y1:-60};
	sidc['G-G-GPPA--'] = icn['TP.ACTION AMNESTY POINT'];//TACGRP.C2GM.GNL.PNT.ACTPNT.AMNPNT
	bbox['G-G-GPPA--'] = {x1:60,x2:140,y1:-60};
	sidc['G-G-GPPW--'] = icn['TP.WAYPOINT'];//TACGRP.C2GM.GNL.PNT.ACTPNT.WAP
	bbox['G-G-GPPW--'] = {x1:60,x2:140,y1:60,y2:140};
	sidc['G-G-GPC---'] = icn['TP.SEA SURFACE CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.SCTL
	bbox['G-G-GPC---'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCU--'] = icn['TP.(USV) CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.SCTL.USV
	bbox['G-G-GPCU--'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCUR-'] = icn['TP.(RMV) USV CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.SCTL.USV.RMV
	bbox['G-G-GPCUR-'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCUA-'] = icn['TP.USV - ASW CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.SCTL.USV.ASW
	bbox['G-G-GPCUA-'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCUS-'] = icn['TP.USV - SUW CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.SCTL.USV.SUW
	bbox['G-G-GPCUS-'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCUM-'] = icn['TP.USV - MIW CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.SCTL.USV.MIW
	bbox['G-G-GPCUM-'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCA--'] = icn['TP.ASW CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.SCTL.ASW
	bbox['G-G-GPCA--'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCS--'] = icn['TP.SUW CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.SCTL.SUW
	bbox['G-G-GPCS--'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCM--'] = icn['TP.MIW CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.SCTL.MIW
	bbox['G-G-GPCM--'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCP--'] = icn['TP.PICKET CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.SCTL.PKT
	bbox['G-G-GPCP--'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCR--'] = icn['TP.RENDEZVOUS CONTROL POINT'];//TACGRP.C2GM.GNL.PNT.SCTL.RDV
	bbox['G-G-GPCR--'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCC--'] = icn['TP.RESCUE CONTROL POINT'];//TACGRP.C2GM.GNL.PNT.SCTL.RSC
	bbox['G-G-GPCC--'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCE--'] = icn['TP.REPLENISHMENT CONTROL POINT'];//TACGRP.C2GM.GNL.PNT.SCTL.REP
	bbox['G-G-GPCE--'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPCN--'] = icn['TP.NONCOMBATANT CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.SCTL.NCBTT
	bbox['G-G-GPCN--'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPB---'] = icn['TP.SUB SURFACE CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.UCTL
	bbox['G-G-GPB---'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPBU--'] = icn['TP.(UUV) CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.UCTL.UUV
	bbox['G-G-GPBU--'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPBUA-'] = icn['TP.UUV - ASW CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.UCTL.UUV.ASW
	bbox['G-G-GPBUA-'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPBUS-'] = icn['TP.UUV - SUW CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.UCTL.UUV.SUW
	bbox['G-G-GPBUS-'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPBUM-'] = icn['TP.UUV - MIW CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.UCTL.UUV.MIW
	bbox['G-G-GPBUM-'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPBS--'] = icn['TP.SUBMARINE CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.UCTL.SBSTN
	bbox['G-G-GPBS--'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-GPBSA-'] = icn['TP.ASW SUBMARINE CONTROL STATION'];//TACGRP.C2GM.GNL.PNT.UCTL.SBSTN.ASW
	bbox['G-G-GPBSA-'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-G-APP---'] = icn['TP.AIR CONTROL POINT (ACP)'];//TACGRP.C2GM.AVN.PNT.ACP
	bbox['G-G-APP---'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-APC---'] = icn['TP.COMMUNICATIONS CHECKPOINT'];//TACGRP.C2GM.AVN.PNT.COMMCP
	bbox['G-G-APC---'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-G-APU---'] = icn['TP.PULL-UP POINT'];//TACGRP.C2GM.AVN.PNT.PUP
	bbox['G-G-APU---'] = {x1:50,x2:240,y1:50,y2:150};
	sidc['G-G-APD---'] = icn['TP.DOWNED AIRCREW PICKUP POINT'];//TACGRP.C2GM.AVN.PNT.DAPP
	bbox['G-G-APD---'] = {x1:60,x2:140,y1:-60};
	sidc['G-G-PN----'] = icn['TP.DUMMY MINEFIELD'];//TACGRP.C2GM.DCPN.DMYMS
	bbox['G-G-PN----'] = {x1:40,x2:160,y1:-10,y2:140};
	sidc['G-G-DPT---'] = icn['TP.TARGET REFERENCE'];//TACGRP.C2GM.DEF.PNT.TGTREF
	sidc['G-G-DPO---'] = icn['TP.OBSERVATION POST/OUTPOST'];//TACGRP.C2GM.DEF.PNT.OBSPST
	bbox['G-G-DPO---'] = {x1:50,x2:150,y1:40,y2:150};
	sidc['G-G-DPOC--'] = icn['TP.COMBAT OUTPOST'];//TACGRP.C2GM.DEF.PNT.OBSPST.CBTPST
	bbox['G-G-DPOC--'] = {x1:50,x2:150,y1:40,y2:150};
	sidc['G-G-DPOR--'] = icn['TP.OBSERVATION POST/RECONNAISSANCE'];//TACGRP.C2GM.DEF.PNT.OBSPST.RECON
	bbox['G-G-DPOR--'] = {x1:50,x2:150,y1:40,y2:150};
	sidc['G-G-DPOF--'] = icn['TP.FORWARD OBSERVER POSITION'];//TACGRP.C2GM.DEF.PNT.OBSPST.FWDOP
	bbox['G-G-DPOF--'] = {x1:50,x2:150,y1:40,y2:150};
	sidc['G-G-DPOS--'] = icn['TP.SENSOR OUTPOST'];//TACGRP.C2GM.DEF.PNT.OBSPST.SOP
	bbox['G-G-DPOS--'] = {x1:50,x2:150,y1:40,y2:150};
	sidc['G-G-DPON--'] = icn['TP.CBRN OBSERVATION POST'];//TACGRP.C2GM.DEF.PNT.OBSPST.CBRNOP
	bbox['G-G-DPON--'] = {x1:50,x2:150,y1:40,y2:150};
	sidc['G-G-OPP---'] = icn['TP.POINT OF DEPARTURE'];//TACGRP.C2GM.OFF.PNT.PNTD
	bbox['G-G-OPP---'] = {x1:60,x2:140,y1:-60};
	sidc['G-M-OAOF--'] = icn['TP.FIXED AND PREFABRICATED'];//TACGRP.MOBSU.OBST.ATO.TDTSM.FIXPFD
	bbox['G-M-OAOF--'] = {x1:60,x2:140,y1:30};
	sidc['G-M-OAOM--'] = icn['TP.TETRAHEDRONS'];//TACGRP.MOBSU.OBST.ATO.TDTSM.MVB
	bbox['G-M-OAOM--'] = {x1:60,x2:140,y1:30};
	sidc['G-M-OAOP--'] = icn['TP.TETRAHEDRONS MOVABLE'];//TACGRP.MOBSU.OBST.ATO.TDTSM.MVBPFD
	bbox['G-M-OAOP--'] = {x1:60,x2:140,y1:30};
	sidc['G-M-OB----'] = icn['TP.BOOBY TRAP'];//TACGRP.MOBSU.OBST.BBY
	sidc['G-M-OMU---'] = icn['TP.UNSPECIFIED MINE'];//TACGRP.MOBSU.OBST.MNE.USPMNE
	sidc['G-M-OMT---'] = icn['TP.ANTITANK MINE (AT)'];//TACGRP.MOBSU.OBST.MNE.ATMNE
	sidc['G-M-OMD---'] = icn['TP.(AT) ANTIHANDLING DEVICE'];//TACGRP.MOBSU.OBST.MNE.ATMAHD
	bbox['G-M-OMD---'] = {x1:60,x2:140,y1:40,y2:195};
	sidc['G-M-OME---'] = icn['TP.(AT) DIRECTIONAL'];//TACGRP.MOBSU.OBST.MNE.ATMDIR
	bbox['G-M-OME---'] = {x1:60,x2:140,y1:10,y2:140};
	sidc['G-M-OMP---'] = icn['TP.ANTIPERSONNEL (AP) MINES'];//TACGRP.MOBSU.OBST.MNE.APMNE
	sidc['G-M-OMW---'] = icn['TP.WIDE AREA MINES'];//TACGRP.MOBSU.OBST.MNE.WAMNE
	sidc['G-M-OFS---'] = icn['TP.MINEFIELDS STATIC'];//TACGRP.MOBSU.OBST.MNEFLD.STC
	bbox['G-M-OFS---'] = {x1:40,x2:160,y1:60,y2:140};
	sidc['G-M-OHTL--'] = icn['TP.TOWER LOW'];//TACGRP.MOBSU.OBST.AVN.TWR.LOW
	bbox['G-M-OHTL--'] = {x1:50,x2:150,y1:30,y2:120};
	sidc['G-M-OHTH--'] = icn['TP.TOWER HIGH'];//TACGRP.MOBSU.OBST.AVN.TWR.HIGH
	bbox['G-M-OHTH--'] = {x1:50,x2:150,y1:30,y2:120};
	sidc['G-M-BCP---'] = icn['TP.ENGINEER REGULATING POINT'];//TACGRP.MOBSU.OBSTBP.CSGSTE.ERP
	bbox['G-M-BCP---'] = {x1:60,x2:140,y1:-60};
	sidc['G-M-SE----'] = icn['TP.EARTHWORK/FORTIFICATION'];//TACGRP.MOBSU.SU.ESTOF
	sidc['G-M-SF----'] = icn['TP.FORT'];//TACGRP.MOBSU.SU.FRT
	sidc['G-M-SS----'] = icn['TP.SURFACE SHELTER'];//TACGRP.MOBSU.SU.SUFSHL
	sidc['G-M-SU----'] = icn['TP.UNDERGROUND SHELTER'];//TACGRP.MOBSU.SU.UGDSHL
	sidc['G-M-NZ----'] = icn['TP.NUCLEAR DETONATIONS GROUND ZERO'];//TACGRP.MOBSU.CBRN.NDGZ
	bbox['G-M-NZ----'] = {x1:60,x2:140,y1:-20};
	sidc['G-M-NF----'] = icn['TP.NUCLEAR FALLOUT PRODUCING'];//TACGRP.MOBSU.CBRN.FAOTP
	bbox['G-M-NF----'] = {x1:50,x2:150,y1:-20};
	sidc['G-M-NEB---'] = icn['TP.RELEASE EVENTS BIOLOGICAL'];//TACGRP.MOBSU.CBRN.REEVNT.BIO
	bbox['G-M-NEB---'] = {x1:-10,x2:140,y1:-20};
	sidc['G-M-NEC---'] = icn['TP.RELEASE EVENTS CHEMICAL'];//TACGRP.MOBSU.CBRN.REEVNT.CML
	bbox['G-M-NEC---'] = {x1:-20,x2:140,y1:-20};
	sidc['G-M-NDP---'] = icn['TP.DECON SITE/POINT'];//TACGRP.MOBSU.CBRN.DECONP.USP
	bbox['G-M-NDP---'] = {x1:60,x2:140,y1:-60};
	sidc['G-M-NDA---'] = icn['TP.ALTERNATE DECON SITE/POINT'];//TACGRP.MOBSU.CBRN.DECONP.ALTUSP
	bbox['G-M-NDA---'] = {x1:60,x2:140,y1:-60};
	sidc['G-M-NDT---'] = icn['TP.DECON SITE/POINT (TROOPS)'];//TACGRP.MOBSU.CBRN.DECONP.TRP
	bbox['G-M-NDT---'] = {x1:60,x2:140,y1:-60};
	sidc['G-M-NDE---'] = icn['TP.DECON SITE/POINT (EQUIPMENT)'];//TACGRP.MOBSU.CBRN.DECONP.EQT
	bbox['G-M-NDE---'] = {x1:60,x2:140,y1:-60};
	sidc['G-M-NDB---'] = icn['TP.DECON SITE/POINT (EQUIPMENT AND TROOPS)'];//TACGRP.MOBSU.CBRN.DECONP.EQTTRP
	bbox['G-M-NDB---'] = {x1:60,x2:140,y1:-60};
	sidc['G-M-NDO---'] = icn['TP.DECON SITE/POINT (OPERATIONAL DECONTAMINATION)'];//TACGRP.MOBSU.CBRN.DECONP.OPDECN
	bbox['G-M-NDO---'] = {x1:60,x2:140,y1:-60};
	sidc['G-M-NDD---'] = icn['TP.DECON SITE/POINT (THOROUGH DECONTAMINATION)'];//TACGRP.MOBSU.CBRN.DECONP.TRGH
	bbox['G-M-NDD---'] = {x1:60,x2:140,y1:-60};
	sidc['G-F-PTS---'] = icn['TP.POINT/SINGLE TARGET'];//TACGRP.FSUPP.PNT.TGT.PTGT
	sidc['G-F-PTN---'] = icn['TP.NUCLEAR TARGET'];//TACGRP.FSUPP.PNT.TGT.NUCTGT
	sidc['G-F-PCF---'] = icn['TP.FIRE SUPPORT STATION'];//TACGRP.FSUPP.PNT.C2PNT.FSS
	sidc['G-F-PCS---'] = icn['TP.SURVEY CONTROL POINT'];//TACGRP.FSUPP.PNT.C2PNT.SCP
	bbox['G-F-PCS---'] = {x1:60,x2:140,y1:-60};
	sidc['G-F-PCB---'] = icn['TP.FIRING POINT'];//TACGRP.FSUPP.PNT.C2PNT.FP
	bbox['G-F-PCB---'] = {x1:60,x2:140,y1:-60};
	sidc['G-F-PCR---'] = icn['TP.RELOAD POINT'];//TACGRP.FSUPP.PNT.C2PNT.RP
	bbox['G-F-PCR---'] = {x1:60,x2:140,y1:-60};
	sidc['G-F-PCH---'] = icn['TP.HIDE POINT'];//TACGRP.FSUPP.PNT.C2PNT.HP
	bbox['G-F-PCH---'] = {x1:60,x2:140,y1:-60};
	sidc['G-F-PCL---'] = icn['TP.LAUNCH POINT'];//TACGRP.FSUPP.PNT.C2PNT.LP
	bbox['G-F-PCL---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PX----'] = icn['TP.AMBULANCE EXCHANGE POINT'];//TACGRP.CSS.PNT.AEP
	bbox['G-S-PX----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PC----'] = icn['TP.CANNIBALIZATION POINT'];//TACGRP.CSS.PNT.CBNP
	bbox['G-S-PC----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PY----'] = icn['TP.CASUALTY COLLECTION POINT'];//TACGRP.CSS.PNT.CCP
	bbox['G-S-PY----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PT----'] = icn['TP.CIVILIAN COLLECTION POINT'];//TACGRP.CSS.PNT.CVP
	bbox['G-S-PT----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PD----'] = icn['TP.DETAINEE COLLECTION POINT'];//TACGRP.CSS.PNT.DCP
	bbox['G-S-PD----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PE----'] = icn['TP.EPW COLLECTION POINT'];//TACGRP.CSS.PNT.EPWCP
	bbox['G-S-PE----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PL----'] = icn['TP.LOGISTICS RELEASE POINT'];//TACGRP.CSS.PNT.LRP
	bbox['G-S-PL----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PM----'] = icn['TP.MAINTENANCE COLLECTION POINT'];//TACGRP.CSS.PNT.MCP
	bbox['G-S-PM----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PR----'] = icn['TP.REARM, REFUEL AND RESUPPLY POINT'];//TACGRP.CSS.PNT.RRRP
	bbox['G-S-PR----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PU----'] = icn['TP.REFUEL ON THE MOVE POINT'];//TACGRP.CSS.PNT.ROM
	bbox['G-S-PU----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PO----'] = icn['TP.TRAFFIC CONTROL POST'];//TACGRP.CSS.PNT.TCP
	bbox['G-S-PO----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PI----'] = icn['TP.TRAILER TRANSFER POINT'];//TACGRP.CSS.PNT.TTP
	bbox['G-S-PI----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PN----'] = icn['TP.UNIT MAINTENANCE COLLECTION POINT'];//TACGRP.CSS.PNT.UMC
	bbox['G-S-PN----'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PSZ---'] = icn['TP.SUPPLY POINT'];//TACGRP.CSS.PNT.SPT.GNL
	bbox['G-S-PSZ---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PSA---'] = icn['TP.SP CLASS I'];//TACGRP.CSS.PNT.SPT.CLS1
	bbox['G-S-PSA---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PSB---'] = icn['TP.SP CLASS II'];//TACGRP.CSS.PNT.SPT.CLS2
	bbox['G-S-PSB---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PSC---'] = icn['TP.SP CLASS III'];//TACGRP.CSS.PNT.SPT.CLS3
	bbox['G-S-PSC---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PSD---'] = icn['TP.SP CLASS IV'];//TACGRP.CSS.PNT.SPT.CLS4
	bbox['G-S-PSD---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PSE---'] = icn['TP.SP CLASS V'];//TACGRP.CSS.PNT.SPT.CLS5
	bbox['G-S-PSE---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PSF---'] = icn['TP.SP CLASS VI'];//TACGRP.CSS.PNT.SPT.CLS6
	bbox['G-S-PSF---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PSG---'] = icn['TP.SP CLASS VII'];//TACGRP.CSS.PNT.SPT.CLS7
	bbox['G-S-PSG---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PSH---'] = icn['TP.SP CLASS VIII'];//TACGRP.CSS.PNT.SPT.CLS8
	bbox['G-S-PSH---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PSI---'] = icn['TP.SP CLASS IX'];//TACGRP.CSS.PNT.SPT.CLS9
	bbox['G-S-PSI---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PSJ---'] = icn['TP.SP CLASS X'];//TACGRP.CSS.PNT.SPT.CLS10
	bbox['G-S-PSJ---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PAS---'] = icn['TP.AMMUNITION SUPPLY POINT (ASP)'];//TACGRP.CSS.PNT.AP.ASP
	bbox['G-S-PAS---'] = {x1:60,x2:140,y1:-60};
	sidc['G-S-PAT---'] = icn['TP.AMMUNITION TRANSFER POINT (ATP)'];//TACGRP.CSS.PNT.AP.ATP
	bbox['G-S-PAT---'] = {x1:60,x2:140,y1:-60};
	sidc['G-O-ED----'] = icn['TP.DITCHED AIRCRAFT'];//TACGRP.OTH.ER.DTHAC
	sidc['G-O-EP----'] = icn['TP.PERSON IN WATER'];//TACGRP.OTH.ER.PIW
	sidc['G-O-EV----'] = icn['TP.DISTRESSED VESSEL'];//TACGRP.OTH.ER.DSTVES
	sidc['G-O-HM----'] = icn['TP.SEA MINELIKE'];//TACGRP.OTH.HAZ.SML
	bbox['G-O-HM----'] = {x1:40,x2:160,y1:40,y2:150};
	sidc['G-O-HI----'] = icn['TP.ICEBERG'];//TACGRP.OTH.HAZ.IB
	bbox['G-O-HI----'] = {x1:50,x2:150,y1:50,y2:150};
	sidc['G-O-HO----'] = icn['TP.OIL RIG/PLATFORM'];//TACGRP.OTH.HAZ.OLRG
	bbox['G-O-HO----'] = {x1:30,x2:170,y1:60,y2:140};
	sidc['G-O-SB----'] = icn['TP.BOTTOM RETURN'];//TACGRP.OTH.SSUBSR.BTMRTN
	bbox['G-O-SB----'] = {x1:40,x2:160,y1:40,y2:100};
	sidc['G-O-SBM---'] = icn['TP.INSTALLATION/MANMADE'];//TACGRP.OTH.SSUBSR.BTMRTN.INS
	bbox['G-O-SBM---'] = {x1:40,x2:160,y1:40,y2:100};
	sidc['G-O-SBN---'] = icn['TP.BOTTOM RETURN'];//TACGRP.OTH.SSUBSR.BTMRTN.SBRSOO
	bbox['G-O-SBN---'] = {x1:40,x2:160,y1:40,y2:100};
	sidc['G-O-SBW---'] = icn['TP.WRECK, NON DANGEROUS'];//TACGRP.OTH.SSUBSR.BTMRTN.WRKND
	bbox['G-O-SBW---'] = {x1:40,x2:160,y1:70,y2:130};
	sidc['G-O-SBX---'] = icn['TP.WRECK, DANGEROUS'];//TACGRP.OTH.SSUBSR.BTMRTN.WRKD
	bbox['G-O-SBX---'] = {x1:40,x2:160,y1:70,y2:130};
	sidc['G-O-SM----'] = icn['TP.MARINE LIFE'];//TACGRP.OTH.SSUBSR.MARLFE
	bbox['G-O-SM----'] = {x1:100,x2:220,y1:70,y2:130};
	sidc['G-O-SS----'] = icn['TP.SEA ANOMALY'];//TACGRP.OTH.SSUBSR.SA
	bbox['G-O-SS----'] = {x1:50,x2:150,y1:30,y2:120};
	sidc['G-O-FA----'] = icn['TP.FIX ACOUSTIC'];//TACGRP.OTH.FIX.ACU
	sidc['G-O-FE----'] = icn['TP.FIX ELECTRO-MAGNETIC'];//TACGRP.OTH.FIX.EM
	sidc['G-O-FO----'] = icn['TP.FIX ELECTRO-OPTICAL'];//TACGRP.OTH.FIX.EOP
	
	
	*/
}