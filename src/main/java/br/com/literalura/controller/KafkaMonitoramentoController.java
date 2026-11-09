package br.com.literalura.controller;

import br.com.literalura.kafka.EventoKafkaMonitorado;
import br.com.literalura.kafka.KafkaMonitoramentoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/monitoramento/kafka")
public class KafkaMonitoramentoController {

    private final KafkaMonitoramentoService monitoramento;

    public KafkaMonitoramentoController(KafkaMonitoramentoService monitoramento) {
        this.monitoramento = monitoramento;
    }

    @GetMapping
    public List<EventoKafkaMonitorado> listar() {
        return monitoramento.listar();
    }
}
