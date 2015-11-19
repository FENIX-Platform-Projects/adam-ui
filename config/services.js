define({
  "dbName_old": "africafertilizer",
 "dbName": "flude",
  "wdsUrl": "http://faostat3.fao.org/wds/rest/table/json",
 


  "queries": {
	

    "pubs_reformat": "SELECT CONCAT('',publications.category),	CONCAT('',publications.title),  CONCAT('',publications.description),  CONCAT('',publications.publication_date), '', " +
    " CONCAT('',publications.source),  CONCAT('',publications.author_name),  '',  CONCAT('',publications.language),   '',  '',  '',  CONCAT('',publications.document_size),  CONCAT('',publications.document_attachment_name)," +
    "   CONCAT('',publications.document_attachment_title),   '','' FROM public.publications",
	
    "events_reformat": "SELECT events_view.id_events, events_view.category, events_view.date_start,events_view.date_end,events_view.description,events_view.title,events_view.long_description,events_view.nbdocs,events_view.ea_type,events_view.ea_file_name,   events_view.ea_attachment_title,   events_view.ea_attachment_size,  events_view.ea_attachment_description, events_view.venue, events_view.country FROM public.events_view",
    "events_reformat_long": "SELECT id_events,category ,date_start ,date_end ,description ,title  from events"


  }
});
