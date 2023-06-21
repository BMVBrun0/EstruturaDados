$(document).ready(function() {
  var adjacencyMatrix = [];
  var deliveries = [];
  var bestPath = null;
  var bestFit = null;

  //Pega o número de nós
  $('#create-graph-btn').click(function() {
    var nodeCount = parseInt($('#node-count').val());
    createGraph(nodeCount);
  });

  //Pega o destino e o Item
  $('#add-delivery-btn').click(function() {
    var destination = $('#destination').val();
    var item = $('#item').val();
    addDelivery(destination, item);
  });

  $('#calculate-btn').click(function() {
    calculatePaths();
    calculateFit();
    findBestPath();
    findBestFit();
  });

  //Cria o grafo
  function createGraph(nodeCount) {
    $('#graph-container').empty();

    var graph = $('<table>');
    for (var i = 0; i < nodeCount; i++) {
      var row = $('<tr>');
      for (var j = 0; j < nodeCount; j++) {
        var cell = $('<td>');
        var input = $('<input type="number">');
        input.addClass('weight-input');
        cell.append(input);
        row.append(cell);
      }
      graph.append(row);
    }

    $('#graph-container').append(graph);
    adjacencyMatrix = [];
  }

  //Adiciona uma entrega
  function addDelivery(destination, item) {
    var row = $('<tr>');
    var destinationCell = $('<td>').text(destination);
    var itemCell = $('<td>').text(item);
    row.append(destinationCell, itemCell);

    $('#deliveries-table tbody').append(row);

    deliveries.push({
      destination: destination,
      item: item
    });

    $('#destination').val('');
    $('#item').val('');
  }

  //Calcula os caminhos
  function calculatePaths() {
    var graph = $('#graph-container table');
    var pathContainer = $('#path-container');
    pathContainer.empty();

    var paths = $('<table>');
    graph.find('tr').each(function() {
      var row = $('<tr>');
      $(this).find('td input').each(function() {
        var cell = $('<td>');
        var input = $('<input type="text">');
        input.addClass('path-input');
        input.val($(this).val());
        cell.append(input);
        row.append(cell);
      });
      paths.append(row);
    });

    pathContainer.append(paths);
  }

  //Calcula as acomodações
  function calculateFit() {
    var length = parseInt($('#length').val());
    var width = parseInt($('#width').val());
    var height = parseInt($('#height').val());
    var capacity = parseInt($('#capacity').val());

    var totalVolume = length * width * height;
    var occupiedVolume = 0;

    //Calcula o volume ocupado somando volumes aleatórios para cada entrega
    deliveries.forEach(function(delivery) {
      var itemVolume = Math.floor(Math.random() * (totalVolume / 2)) + 1;
      occupiedVolume += itemVolume;
    });

    var remainingVolume = capacity - occupiedVolume;

    var fitResult = $('<div>');
    fitResult.append('<p>Volume total: ' + totalVolume + ' cm³</p>');
    fitResult.append('<p>Volume ocupado: ' + occupiedVolume + ' cm³</p>');
    fitResult.append('<p>Volume restante: ' + remainingVolume + ' cm³</p>');

    $('#result-container').append(fitResult);
  }

  //Encontra o melhor caminho
  function findBestPath() {
    var paths = $('#path-container table');
    var bestWeight = Infinity;

    paths.find('tr').each(function() {
      $(this).find('td input').each(function() {
        var weight = parseInt($(this).val());
        if (weight < bestWeight) {
          bestWeight = weight;
          bestPath = $(this).parent().index() + '-' + $(this).index();
        }
      });
    });

    var bestPathContainer = $('<div>');
    bestPathContainer.append('<p>Melhor caminho: ' + bestPath + ' (' + bestWeight + ')</p>');

    $('#result-container').append(bestPathContainer);
  }

  //Encontra a melhor acomodação
  function findBestFit() {
    var length = parseInt($('#length').val());
    var width = parseInt($('#width').val());
    var height = parseInt($('#height').val());
    var capacity = parseInt($('#capacity').val());

    var totalVolume = length * width * height;
    var bestFitIndex = -1;
    var bestFitRemainingVolume = Infinity;

    deliveries.forEach(function(delivery, index) {
      var itemVolume = Math.floor(Math.random() * (totalVolume / 2)) + 1;
      var remainingVolume = capacity - itemVolume;

      if (remainingVolume < bestFitRemainingVolume) {
        bestFitRemainingVolume = remainingVolume;
        bestFitIndex = index;
      }
    });

    var bestFitContainer = $('<div>');
    bestFitContainer.append('<p>Melhor acomodação: ' + deliveries[bestFitIndex].destination + ' (' + bestFitRemainingVolume + ' cm³ restantes)</p>');

    $('#result-container').append(bestFitContainer);
  }
});
