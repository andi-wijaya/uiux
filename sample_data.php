<?php

$sample_items = [
  [ 'text'=>"Lorem ipsum", 'value'=>"Lorem ipsum" ],
  [ 'text'=>"dolor sit amet", 'value'=>"dolor sit amet" ],
  [ 'text'=>"consectetur", 'value'=>"consectetur" ],
  [ 'text'=>"adipiscing", 'value'=>"adipiscing" ],
  [ 'text'=>"Mauris nibh mi", 'value'=>"Mauris nibh mi" ],
];

header('Content-Type: application/json');
echo json_encode([
  'data'=>$sample_items
]);

?>