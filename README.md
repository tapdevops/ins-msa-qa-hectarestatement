TM_BLOCK 	-> 05 Agustus 2019 (100)
TM_BLOCK 	-> 12 Agustus 2019 (115)
------------------------------------
							     15


Mas Amin Sync, tanggal 10 Agustus 2019 (Pertama kali sync), dapat data 100
-> Kirim data ke T_MOBILE_SYNC (IMEI, TANGGAL, TABEL_UPDATE, INSERT USER) (TM_BLOCK

Mas Amin Sync ke 2, tanggal 15 Agustus 2019
-> Ambil data 10 Agustus 2019 - 15 Agustus 2019 -> 15 (Berdasarkan Update time )
-> Balikin 15 data
-> Kirim data ke T_MOBILE_SYNC (IMEI, TANGGAL, TABEL_UPDATE, INSERT USER) (TM_BLOCK) (15 Agustus 2019)









TM_BLOCK 	-> 05 Agustus 2019 (100)
TM_BLOCK 	-> 12 Agustus 2019 (115)
------------------------------------
							     15 (Disimpan)
							     Ambil dari Insert time yang rangenya tgl_terakhir_sync, sampai tgl sync (hari dia sync)





TM_BLOCK 	-> 05 Agustus 2019 (100)
TM_BLOCK 	-> 12 Agustus 2019 (100)
------------------------------------

Delete time / Update time
