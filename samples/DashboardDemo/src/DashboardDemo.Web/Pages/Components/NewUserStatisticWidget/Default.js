﻿abp.widgets = abp.widgets || {}; //TODO: Remove later
(function () {
    abp.widgets.NewUserStatisticWidget = function($wrapper) {

        var _latestFilters;
        var _chart;

        var refresh = function(filters) {
            _latestFilters = filters || _latestFilters;
            dashboardDemo.dashboard.getNewUserStatisticWidget({
                startDate: _latestFilters.startDate,
                endDate: _latestFilters.endDate,
                frequency: $wrapper.find('.frequency-filter option:selected').val()
            }).then(function(result) {
                _chart.data = {
                    labels: Object.keys(result.data),
                    datasets: [
                        {
                            label: 'User count',
                            data: Object.values(result.data),
                            backgroundColor: 'rgba(255, 132, 132, 1)'
                        }
                    ]
                };
                _chart.update();
            });
        };

        var init = function(filters) {
            _chart = new Chart($wrapper.find('.NewUserStatisticChart'),
                {
                    type: 'bar',
                    options: {
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }
                            ]
                        }
                    }
                });

            refresh(filters);

            $wrapper
                .find('.frequency-filter')
                .on('change',
                    function() {
                        refresh();
                    });
        };

        return {
            init: init,
            refresh: refresh
        };
    };
})();