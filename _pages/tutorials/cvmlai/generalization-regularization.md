---
layout: archive
title: "Generalization & Robust Neural Networks"
permalink: /Resources/deep-learning/generalization/
author_profile: true
---

[Back to Deep Learning topics](/Resources/deep-learning/)

[Open the sample lecture slides](/Resources/deep-learning/generalization-slides/)

<!-- Concept 1 -->
<div class="problem-card" id="overfitting">
    <div class="problem-header">
        <h3 class="problem-title">1. <a href="#overfitting">The Problem of Overfitting</a></h3>
        <span class="badge badge-easy">Concept</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Symptom:</strong> Training loss falls, validation loss rises</div>
        <div class="meta-item"><strong>Model:</strong> 3 fully connected layers (784 → 512 → 256 → 10)</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Build a simple image classifier with three fully connected layers and show how it memorizes the training data instead of learning patterns that carry over to unseen images.</p>
    <div class="section-subtitle">Explanation</div>
    <p>A model <strong>overfits</strong> when it fits the noise and quirks of the training set rather than the underlying signal. The training error keeps shrinking, but the error on unseen data stops improving and then grows. The gap between the two is the <em>generalization gap</em>:</p>
    <p>$$\text{gap} = \mathcal{L}_{\text{val}} - \mathcal{L}_{\text{train}}$$</p>
    <p>Overfitting is more likely when the model has many parameters, the training set is small, or training runs for too long. To make it easy to observe, the code below trains on only 5,000 MNIST images with a large network. The helper functions defined here (<code>train_one_epoch</code>, <code>evaluate</code>) are reused in every section that follows.</p>
    <div class="section-subtitle">PyTorch Solution</div>
    {% highlight python %}
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms

torch.manual_seed(42)
device = "cuda" if torch.cuda.is_available() else "cpu"

# ---------- Data ----------
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,)),
])
full_train = datasets.MNIST("./data", train=True, download=True, transform=transform)
test_set = datasets.MNIST("./data", train=False, download=True, transform=transform)

# A small training set makes overfitting easy to see
train_set, val_set, _ = random_split(full_train, [5000, 5000, 50000])

train_loader = DataLoader(train_set, batch_size=64, shuffle=True)
val_loader = DataLoader(val_set, batch_size=256)
test_loader = DataLoader(test_set, batch_size=256)


# ---------- Baseline model: three fully connected layers ----------
class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(28 * 28, 512)
        self.fc2 = nn.Linear(512, 256)
        self.fc3 = nn.Linear(256, 10)y

    def forward(self, x):
        x = x.view(x.size(0), -1)      # flatten the image
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        return self.fc3(x)             # raw logits


# ---------- Helpers ----------
def train_one_epoch(model, loader, optimizer):
    model.train()                      # enable training behaviour
    total_loss, correct = 0.0, 0
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = F.cross_entropy(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item() * images.size(0)
        correct += (outputs.argmax(1) == labels).sum().item()
    n = len(loader.dataset)
    return total_loss / n, correct / n


@torch.no_grad()
def evaluate(model, loader):
    model.eval()                       # disable dropout, use BN running stats
    total_loss, correct = 0.0, 0
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        total_loss += F.cross_entropy(outputs, labels).item() * images.size(0)
        correct += (outputs.argmax(1) == labels).sum().item()
    n = len(loader.dataset)
    return total_loss / n, correct / n


# ---------- Train the baseline for many epochs ----------
model = SimpleNet().to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for epoch in range(1, 31):
    train_loss, train_acc = train_one_epoch(model, train_loader, optimizer)
    val_loss, val_acc = evaluate(model, val_loader)
    print(f"Epoch {epoch:2d} | train loss {train_loss:.4f} acc {train_acc:.3f} "
          f"| val loss {val_loss:.4f} acc {val_acc:.3f}")

# Typical result: train accuracy approaches 100% while validation loss
# starts increasing after a few epochs, which is the signature of overfitting.
    {% endhighlight %}
</div>

<!-- Concept 2 -->
<div class="problem-card" id="regularization">
    <div class="problem-header">
        <h3 class="problem-title">2. <a href="#regularization">Regularization to Improve Generalization</a></h3>
        <span class="badge badge-medium">Technique</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Idea:</strong> Penalize large weights</div>
        <div class="meta-item"><strong>PyTorch API:</strong> <code>weight_decay</code> in the optimizer</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Constrain the network so that it prefers simpler solutions, reducing the generalization gap without changing the architecture.</p>
    <div class="section-subtitle">Explanation</div>
    <p><strong>Regularization</strong> adds a penalty to the loss so that large weights become expensive. With <strong>L2 regularization</strong> (weight decay) the objective becomes:</p>
    <p>\(\mathcal{L} = \mathcal{L}_{\text{data}} + \frac{\lambda}{2} \sum_i w_i^2\)</p>
    <p>Small weights keep the function smooth, so tiny changes in the input cannot cause large swings in the output. <strong>L1 regularization</strong> uses \(\lambda \sum_i |w_i|\) instead and pushes many weights to exactly zero, producing sparse networks. In PyTorch, L2 is applied with the optimizer's <code>weight_decay</code> argument. <code>AdamW</code> is generally preferred over <code>Adam</code> because it decouples the decay from the adaptive gradient update. Typical values of \(\lambda\) lie between \(10^{-5}\) and \(10^{-2}\).</p>
    <div class="section-subtitle">PyTorch Solution</div>
    {% highlight python %}
# Same SimpleNet as before, only the optimizer changes
model = SimpleNet().to(device)

optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=1e-3,
    weight_decay=1e-2,      # lambda: strength of the L2 penalty
)

for epoch in range(1, 31):
    train_loss, train_acc = train_one_epoch(model, train_loader, optimizer)
    val_loss, val_acc = evaluate(model, val_loader)
    print(f"Epoch {epoch:2d} | train loss {train_loss:.4f} | val loss {val_loss:.4f} "
          f"| val acc {val_acc:.3f}")


# Optional: manual L1 penalty added directly to the loss
def l1_penalty(model, lam=1e-5):
    return lam * sum(p.abs().sum() for p in model.parameters())

# Inside the training loop:
#   loss = F.cross_entropy(outputs, labels) + l1_penalty(model)
    {% endhighlight %}
</div>

<!-- Concept 3 -->
<div class="problem-card" id="dropout">
    <div class="problem-header">
        <h3 class="problem-title">3. <a href="#dropout">Dropout: Reduce Reliance on Specific Neurons</a></h3>
        <span class="badge badge-medium">Technique</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Idea:</strong> Randomly zero neurons during training</div>
        <div class="meta-item"><strong>PyTorch API:</strong> <code>nn.Dropout(p)</code></div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Stop neurons from co-adapting, so that no single neuron or small group of neurons becomes critical for a correct prediction.</p>
    <div class="section-subtitle">Explanation</div>
    <p>During each training step, <strong>dropout</strong> sets every activation to zero with probability \(p\) and scales the surviving activations by \(\frac{1}{1-p}\) so the expected value stays the same. Because a different random subset of neurons is active each step, the network is forced to spread useful information across many neurons. It behaves like training and averaging a large ensemble of thinned sub-networks.</p>
    <p>Dropout is active only in <code>model.train()</code> mode. Calling <code>model.eval()</code> turns it off, so the full network is used at inference time. Forgetting to switch modes is a very common bug. Typical rates are \(p = 0.2\) to \(0.5\) for fully connected layers, and dropout is normally not applied to the output layer.</p>
    <div class="section-subtitle">PyTorch Solution</div>
    {% highlight python %}
class DropoutNet(nn.Module):
    def __init__(self, p=0.3):
        super().__init__()
        self.fc1 = nn.Linear(28 * 28, 512)
        self.fc2 = nn.Linear(512, 256)
        self.fc3 = nn.Linear(256, 10)
        self.dropout = nn.Dropout(p)

    def forward(self, x):
        x = x.view(x.size(0), -1)
        x = self.dropout(F.relu(self.fc1(x)))   # drop after hidden layer 1
        x = self.dropout(F.relu(self.fc2(x)))   # drop after hidden layer 2
        return self.fc3(x)                      # no dropout on the output


model = DropoutNet(p=0.3).to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for epoch in range(1, 31):
    train_loss, _ = train_one_epoch(model, train_loader, optimizer)   # dropout ON
    val_loss, val_acc = evaluate(model, val_loader)                   # dropout OFF
    print(f"Epoch {epoch:2d} | train loss {train_loss:.4f} | val loss {val_loss:.4f} "
          f"| val acc {val_acc:.3f}")
    {% endhighlight %}
</div>

<!-- Concept 4 -->
<div class="problem-card" id="early-stopping">
    <div class="problem-header">
        <h3 class="problem-title">4. <a href="#early-stopping">Early Stopping: When to Stop Training</a></h3>
        <span class="badge badge-medium">Technique</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Idea:</strong> Stop when validation loss stops improving</div>
        <div class="meta-item"><strong>Key Parameter:</strong> <code>patience</code></div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Decide automatically when to stop training so the model is kept at the point where it generalizes best, instead of picking a fixed number of epochs.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Monitor the loss on a held-out validation set after every epoch. Training loss almost always keeps decreasing, but validation loss reaches a minimum and then rises as the model starts to overfit. <strong>Early stopping</strong> halts training once validation loss has not improved for <code>patience</code> consecutive epochs, and restores the weights from the best epoch.</p>
    <p>A small <code>min_delta</code> prevents tiny, noisy improvements from resetting the counter. Early stopping costs nothing extra and acts as an implicit regularizer, because it limits how far the weights can move away from their small initial values.</p>
    <div class="section-subtitle">PyTorch Solution</div>
    {% highlight python %}
import copy


class EarlyStopping:
    def __init__(self, patience=5, min_delta=0.0):
        self.patience = patience
        self.min_delta = min_delta
        self.best_loss = float("inf")
        self.counter = 0
        self.best_state = None
        self.should_stop = False

    def step(self, val_loss, model):
        if val_loss < self.best_loss - self.min_delta:
            self.best_loss = val_loss
            self.counter = 0
            self.best_state = copy.deepcopy(model.state_dict())   # remember best weights
        else:
            self.counter += 1
            if self.counter >= self.patience:
                self.should_stop = True


model = DropoutNet(p=0.3).to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
early_stopper = EarlyStopping(patience=5, min_delta=1e-4)

for epoch in range(1, 101):                       # large upper bound on epochs
    train_loss, _ = train_one_epoch(model, train_loader, optimizer)
    val_loss, val_acc = evaluate(model, val_loader)
    print(f"Epoch {epoch:3d} | train loss {train_loss:.4f} | val loss {val_loss:.4f} "
          f"| val acc {val_acc:.3f}")

    early_stopper.step(val_loss, model)
    if early_stopper.should_stop:
        print(f"Early stopping at epoch {epoch}")
        break

model.load_state_dict(early_stopper.best_state)   # restore the best model
    {% endhighlight %}
</div>

<!-- Concept 5 -->
<div class="problem-card" id="batch-normalization">
    <div class="problem-header">
        <h3 class="problem-title">5. <a href="#batch-normalization">Batch Normalization</a></h3>
        <span class="badge badge-medium">Technique</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Idea:</strong> Normalize intermediate activations</div>
        <div class="meta-item"><strong>PyTorch API:</strong> <code>nn.BatchNorm1d(features)</code></div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Stabilize and speed up training by keeping the inputs of each layer on a consistent scale, which also gives a mild regularizing effect.</p>
    <div class="section-subtitle">Explanation</div>
    <p>For each feature in a mini-batch \(B\), <strong>batch normalization</strong> computes the batch mean \(\mu_B\) and variance \(\sigma_B^2\), and normalizes the activations to zero mean and unit variance:</p>
    <p>\(\hat{x}_i = \dfrac{x_i - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}, \qquad y_i = \gamma \hat{x}_i + \beta\)</p>
    <p>The learnable parameters \(\gamma\) (scale) and \(\beta\) (shift) let the network undo the normalization if that is what works best. Normalized activations allow higher learning rates and make training less sensitive to weight initialization. Because each sample is normalized using statistics of the random mini-batch it appears in, a small amount of noise is added, which gives a slight regularization effect.</p>
    <p>During training the layer also keeps running averages of the mean and variance. In <code>model.eval()</code> mode these running statistics are used instead of batch statistics, so predictions do not depend on the other samples in the batch. The usual order is <code>Linear → BatchNorm → ReLU → Dropout</code>.</p>
    <div class="section-subtitle">PyTorch Solution</div>
    {% highlight python %}
class BatchNormNet(nn.Module):
    def __init__(self, p=0.3):
        super().__init__()
        self.fc1 = nn.Linear(28 * 28, 512)
        self.bn1 = nn.BatchNorm1d(512)
        self.fc2 = nn.Linear(512, 256)
        self.bn2 = nn.BatchNorm1d(256)
        self.fc3 = nn.Linear(256, 10)
        self.dropout = nn.Dropout(p)

    def forward(self, x):
        x = x.view(x.size(0), -1)
        x = self.dropout(F.relu(self.bn1(self.fc1(x))))   # Linear -> BN -> ReLU -> Dropout
        x = self.dropout(F.relu(self.bn2(self.fc2(x))))
        return self.fc3(x)


model = BatchNormNet(p=0.3).to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)

for epoch in range(1, 21):
    train_loss, _ = train_one_epoch(model, train_loader, optimizer)   # uses batch statistics
    val_loss, val_acc = evaluate(model, val_loader)                   # uses running statistics
    print(f"Epoch {epoch:2d} | train loss {train_loss:.4f} | val loss {val_loss:.4f} "
          f"| val acc {val_acc:.3f}")
    {% endhighlight %}
</div>

<!-- Concept 6 -->
<div class="problem-card" id="putting-it-together">
    <div class="problem-header">
        <h3 class="problem-title">6. <a href="#putting-it-together">Putting It All Together</a></h3>
        <span class="badge badge-medium">Summary</span>
    </div>
    <div class="meta-info">
        <div class="meta-item"><strong>Combines:</strong> Weight decay + Dropout + BatchNorm + Early stopping</div>
        <div class="meta-item"><strong>Final Check:</strong> Accuracy on the untouched test set</div>
    </div>
    <div class="section-subtitle">Problem Statement</div>
    <p>Combine all four techniques into one training pipeline for a more generalizable and robust three-layer classifier, and measure it once on the test set.</p>
    <div class="section-subtitle">Explanation</div>
    <p>Each technique attacks overfitting from a different angle, so they work well together:</p>
    <p><strong>Weight decay</strong> keeps weights small, <strong>dropout</strong> prevents neurons from co-adapting, <strong>batch normalization</strong> stabilizes the activations between layers, and <strong>early stopping</strong> ends training at the best validation point. The test set is used only once at the end, because using it to tune hyperparameters would leak information and give an over-optimistic estimate of real-world performance.</p>
    <p>If the model still overfits, increase the dropout rate or weight decay, or add more training data (data augmentation is another very effective regularizer). If it underfits, reduce the regularization strength or increase the model size.</p>
    <div class="section-subtitle">PyTorch Solution</div>
    {% highlight python %}
model = BatchNormNet(p=0.3).to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
early_stopper = EarlyStopping(patience=5, min_delta=1e-4)

for epoch in range(1, 101):
    train_loss, train_acc = train_one_epoch(model, train_loader, optimizer)
    val_loss, val_acc = evaluate(model, val_loader)
    print(f"Epoch {epoch:3d} | train loss {train_loss:.4f} acc {train_acc:.3f} "
          f"| val loss {val_loss:.4f} acc {val_acc:.3f}")

    early_stopper.step(val_loss, model)
    if early_stopper.should_stop:
        print(f"Early stopping at epoch {epoch}")
        break

# Restore the best weights and evaluate once on unseen data
model.load_state_dict(early_stopper.best_state)
test_loss, test_acc = evaluate(model, test_loader)
print(f"Test loss {test_loss:.4f} | Test accuracy {test_acc:.4f}")
    {% endhighlight %}
</div>
